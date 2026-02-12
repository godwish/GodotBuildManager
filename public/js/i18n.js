class I18n {
    constructor() {
        const savedLocale = localStorage.getItem('locale');
        const browserLocale = navigator.language.startsWith('ko') ? 'ko' : 'en';
        this.locale = savedLocale || browserLocale;
        this.translations = {};
        this.supportedLanguages = [];
    }

    get currentLocale() {
        return this.locale;
    }

    async init() {
        await this.loadSupportedLanguages();
        await this.loadLocale(this.locale);
        this.populateLanguageSelector(); // Populate selector after languages are loaded
        this.updatePage();
    }

    async loadSupportedLanguages() {
        try {
            const response = await fetch('locales/languages.json');
            if (response.ok) {
                this.supportedLanguages = await response.json();
            } else {
                console.warn('Failed to load supported languages. Using defaults.');
                // Fallback if file missing
                this.supportedLanguages = [
                    { code: 'en', name: 'English' },
                    { code: 'ko', name: '한국어' }
                ];
            }
        } catch (error) {
            console.error('Error loading languages:', error);
            this.supportedLanguages = [
                { code: 'en', name: 'English' },
                { code: 'ko', name: '한국어' }
            ];
        }
    }

    populateLanguageSelector() {
        const langSelect = document.getElementById('lang-select');
        if (langSelect) {
            langSelect.innerHTML = '';
            this.supportedLanguages.forEach(lang => {
                const option = document.createElement('option');
                option.value = lang.code;
                option.textContent = lang.name;
                if (lang.code === this.locale) {
                    option.selected = true;
                }
                langSelect.appendChild(option);
            });

            // Re-attach listener if needed, but app.js attaches one.
            // Ideally app.js waits for init.
        }
    }

    async loadLocale(locale) {
        try {
            // Check if locale is supported, if not fallback to en
            const isSupported = this.supportedLanguages.some(l => l.code === locale);
            if (!isSupported && this.supportedLanguages.length > 0) {
                locale = 'en';
            }

            const response = await fetch(`locales/${locale}.json`);
            this.translations = await response.json();
            this.locale = locale;
            localStorage.setItem('locale', locale);
            document.documentElement.lang = locale;
        } catch (error) {
            console.error(`Failed to load locale: ${locale}`, error);
        }
    }

    async setLocale(locale) {
        await this.loadLocale(locale);
        this.updatePage();

        // Update switcher UI
        const langSelect = document.getElementById('lang-select');
        if (langSelect) {
            langSelect.value = locale;
        }

        // Dispatch event so app.js can re-render dynamic content if needed
        window.dispatchEvent(new CustomEvent('localeChanged', { detail: { locale } }));
    }

    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations;

        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return key; // Return key if translation missing
            }
        }

        if (typeof value !== 'string') return key;

        // Replace parameters {param}
        return value.replace(/{(\w+)}/g, (match, p1) => {
            return params[p1] !== undefined ? params[p1] : match;
        });
    }

    updatePage() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);

            // Handle placeholders/inputs vs text content
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.hasAttribute('placeholder')) {
                    el.placeholder = translation;
                }
            } else {
                el.textContent = translation;
            }
        });
    }
}

const i18n = new I18n();
// Initialize on load is handled in app.js or script tag, 
// strictly speaking we should probably wait for DOMContentLoaded, 
// but let's expose it first.
window.i18n = i18n;
