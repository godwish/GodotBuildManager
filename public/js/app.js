document.addEventListener('DOMContentLoaded', async () => {
    await window.i18n.init();
    await initConfig();
    initTabs();
    initUpload();
    checkAccess();

    // Set initial active state for language switcher
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.value = i18n.currentLocale;
        langSelect.addEventListener('change', (e) => {
            i18n.setLocale(e.target.value);
        });
    }

    // Initial Load
    loadBuilds('web');
    loadLatest('web');
    loadBuilds('android');
    loadLatest('android');

    // Subscribe to language changes
    window.addEventListener('localeChanged', () => {
        // Refresh all dynamic content (lists and latest builds)
        // This ensures that hidden tabs are also updated with the new locale
        loadBuilds('web');
        loadLatest('web');
        loadBuilds('android');
        loadLatest('android');
    });
});

async function initConfig() {
    try {
        const response = await fetch('/api/config');
        if (response.ok) {
            const config = await response.json();
            if (config.title) {
                document.title = config.title;
                const headerTitle = document.querySelector('h1');
                if (headerTitle) {
                    headerTitle.innerText = config.title;
                    // Remove data-i18n to prevent overwriting on locale change
                    headerTitle.removeAttribute('data-i18n');
                }
            }
        }
    } catch (error) {
        console.error('Failed to load config:', error);
    }
}

// --- Navigation & Access ---

function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            // Activate clicked tab
            tab.classList.add('active');
            const target = tab.dataset.tab;
            document.getElementById(`${target}-section`).classList.add('active');
        });
    });
}

function checkAccess() {
    const hostname = window.location.hostname;
    // Simple check for local network IP or localhost
    const isInternal =
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.startsWith('192.168.') ||
        hostname.includes('::1'); // IPv6 localhost

    if (isInternal) {
        const uploadBtn = document.getElementById('upload-tab-btn');
        if (uploadBtn) uploadBtn.style.display = 'inline-block';
        window.isInternalUser = true;
    } else {
        window.isInternalUser = false;
    }
}

// --- Data Fetching & Rendering ---

async function loadBuilds(type, page = 1) {
    try {
        const response = await fetch(`/api/builds/${type}?page=${page}`);
        const data = await response.json();

        if (data.builds) {
            renderBuildList(data.builds, type);
            renderPagination(data.totalPages, data.page, type);
        }
    } catch (error) {
        console.error(`Error loading ${type} builds:`, error);
    }
}

async function loadLatest(type) {
    try {
        const response = await fetch(`/api/builds/${type}/latest`);
        if (!response.ok) {
            if (response.status === 404) {
                const container = document.getElementById(`${type}-latest`);
                if (container) {
                    container.innerHTML = `<p style="text-align: center; color: var(--text-secondary); margin: 1rem 0;">${i18n.t('message.no_builds')}</p>`;
                }
            }
            return;
        }

        const build = await response.json();
        renderLatest(build, type);
    } catch (error) {
        console.error(`Error loading latest ${type}:`, error);
    }
}

function renderBuildList(builds, type) {
    const listContainer = document.getElementById(`${type}-list`);
    listContainer.innerHTML = '';

    if (builds.length === 0) {
        listContainer.innerHTML = `<div class="build-item">${i18n.t('message.no_builds')}</div>`;
        return;
    }

    builds.forEach(build => {
        const date = new Date(build.upload_time).toLocaleString(i18n.currentLocale);
        const actionText = type === 'web' ? i18n.t('action.run_game') : i18n.t('action.download');
        const actionLink = build.path;
        // For web, open in new tab? Or maybe same tab? User said "최신버전 실행" and "게임 실행"
        // Usually web games run better in a clean window/tab.
        const targetAttr = type === 'web' ? 'target="_blank"' : '';

        const item = document.createElement('div');
        item.className = 'build-item';
        item.innerHTML = `
            <div>${build.version}</div>
            <div>${date}</div>
            <div>${build.description || '-'}</div>
            <div>
                <a href="${actionLink}" class="action-btn" ${targetAttr}>${actionText}</a>
                ${window.isInternalUser ? `<button class="delete-btn" onclick="deleteBuild('${type}', '${build.id}')">${i18n.t('action.delete')}</button>` : ''}
            </div>
        `;
        listContainer.appendChild(item);
    });
}

window.deleteBuild = async (type, id) => {
    if (!confirm(i18n.t('message.confirm_delete'))) return;

    try {
        const response = await fetch(`/api/builds/${type}/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();

        if (response.ok) {
            alert(i18n.t('message.delete_success'));
            // Refresh
            loadBuilds(type);
            loadLatest(type);
        } else {
            throw new Error(result.error || 'Delete failed');
        }
    } catch (error) {
        alert(i18n.t('message.error', { error: error.message }));
    }
};

function renderLatest(build, type) {
    const container = document.getElementById(`${type}-latest`);
    const actionText = type === 'web' ? i18n.t('action.play_latest') : i18n.t('action.download_latest');
    const targetAttr = type === 'web' ? 'target="_blank"' : '';

    container.innerHTML = `
        <h3>${i18n.t('section.latest_release', { version: build.version })}</h3>
        <p style="margin: 0.5rem 0; color: var(--text-secondary)">${new Date(build.upload_time).toLocaleString(i18n.currentLocale)}</p>
        <a href="${build.path}" class="action-btn" style="padding: 0.75rem 2rem; font-size: 1.1rem;" ${targetAttr}>${actionText}</a>
    `;
}

function renderPagination(totalPages, currentPage, type) {
    const container = document.getElementById(`${type}-pagination`);
    container.innerHTML = '';

    if (totalPages <= 1) return;

    // Simple previous/next for now
    if (currentPage > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.innerText = i18n.t('action.prev');
        prevBtn.className = 'action-btn'; // Reusing style but checking valid logic?
        prevBtn.style.marginRight = '10px';
        prevBtn.onclick = () => loadBuilds(type, currentPage - 1);
        container.appendChild(prevBtn);
    }

    const info = document.createElement('span');
    info.innerText = i18n.t('message.page_info', { page: currentPage, total: totalPages });
    info.style.color = 'var(--text-secondary)';
    container.appendChild(info);

    if (currentPage < totalPages) {
        const nextBtn = document.createElement('button');
        nextBtn.innerText = i18n.t('action.next');
        nextBtn.className = 'action-btn';
        nextBtn.style.marginLeft = '10px';
        nextBtn.onclick = () => loadBuilds(type, currentPage + 1);
        container.appendChild(nextBtn);
    }
}

// --- Upload Logic ---

function initUpload() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const typeBtns = document.querySelectorAll('.type-btn');
    const hiddenTypeInput = document.getElementById('upload-type');

    // Type switching
    typeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission if inside form
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            hiddenTypeInput.value = btn.dataset.type;
        });
    });

    // File Selection
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => updateFileInfo(fileInput.files[0]));

    // Drag & Drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            updateFileInfo(e.dataTransfer.files[0]);
        }
    });

    // Form Submit
    const form = document.getElementById('upload-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const file = fileInput.files[0];
        if (!file) {
            alert(i18n.t('upload.select_file_alert'));
            return;
        }

        const type = hiddenTypeInput.value;
        const formData = new FormData(form);

        // UI Feedback
        const statusDiv = document.getElementById('upload-status');
        const submitBtn = document.getElementById('publish-btn');
        submitBtn.disabled = true;
        submitBtn.innerText = i18n.t('upload.publishing');
        statusDiv.innerText = '';
        statusDiv.className = 'status-message';

        try {
            const response = await fetch(`/api/upload/${type}`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                statusDiv.innerText = i18n.t('upload.success');
                statusDiv.classList.add('success'); // Add css class for green text
                statusDiv.style.color = 'var(--success-color)';

                // Refresh lists
                loadBuilds(type);
                loadLatest(type);

                // Reset form
                form.reset();
                document.getElementById('file-info').innerText = '';
            } else {
                throw new Error(result.error || 'Upload failed');
            }
        } catch (error) {
            statusDiv.innerText = i18n.t('message.error', { error: error.message }) || `Error: ${error.message}`;
            statusDiv.classList.add('error');
            statusDiv.style.color = 'var(--error-color)';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = i18n.t('upload.publish_btn');
        }
    });
}

function updateFileInfo(file) {
    const infoDiv = document.getElementById('file-info');
    if (file) {
        infoDiv.innerText = i18n.t('upload.selected_file', { fileName: file.name, size: (file.size / 1024 / 1024).toFixed(2) });
    } else {
        infoDiv.innerText = '';
    }
}
