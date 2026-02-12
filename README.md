# GodotBuildManager

A web-based tool for managing and distributing Godot game builds (Web and Android).

[English](#english) | [한국어](#한국어) | [日本語](#日本語)

---

## English

### Technologies Used
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: SQLite (via `better-sqlite3`)
-   **Frontend**: Vanilla HTML/CSS/JS
-   **Other**: Multer (file upload), Adm-Zip (zip extraction)

### Deployment Instructions

#### 1. Prerequisites
-   Node.js (v14 or higher)
-   npm (Node Package Manager)

#### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/GodotBuildManager.git
cd GodotBuildManager
npm install
```

#### 3. Environment Setup
**Security Note**: Never commit your `.env` file to version control.

1.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
2.  Open `.env` and configure your settings:
    ```ini
    PORT=3000
    APP_TITLE=Godot Build Manager
    ```

#### 4. Running the Application
Start the server:
```bash
npm start
```
The application will be available at `http://localhost:3000`.

---

## 한국어

### 사용 기술
-   **런타임**: Node.js
-   **프레임워크**: Express.js
-   **데이터베이스**: SQLite (`better-sqlite3`)
-   **프론트엔드**: Vanilla HTML/CSS/JS
-   **기타**: Multer (파일 업로드), Adm-Zip (ZIP 압축 해제)

### 배포 방법

#### 1. 필수 조건
-   Node.js (v14 이상)
-   npm

#### 2. 설치
저장소를 클론하고 의존성을 설치합니다:
```bash
git clone https://github.com/your-username/GodotBuildManager.git
cd GodotBuildManager
npm install
```

#### 3. 환경 설정
**보안 주의**: `.env` 파일은 절대 버전 관리 시스템에 올리지 마세요.

1.  예제 환경 파일을 복사합니다:
    ```bash
    cp .env.example .env
    ```
2.  `.env` 파일을 열어 설정을 수정합니다:
    ```ini
    PORT=3000
    APP_TITLE=Godot Build Manager
    ```

#### 4. 실행
서버를 시작합니다:
```bash
npm start
```
애플리케이션은 `http://localhost:3000`에서 접속할 수 있습니다.

---

## 日本語

### 使用技術
-   **ランタイム**: Node.js
-   **フレームワーク**: Express.js
-   **データベース**: SQLite (`better-sqlite3`)
-   **フロントエンド**: Vanilla HTML/CSS/JS
-   **その他**: Multer (ファイルアップロード), Adm-Zip (ZIP解凍)

### デプロイ方法

#### 1. 前提条件
-   Node.js (v14以上)
-   npm

#### 2. インストール
リポジトリをクローンし、依存関係をインストールします:
```bash
git clone https://github.com/your-username/GodotBuildManager.git
cd GodotBuildManager
npm install
```

#### 3. 環境設定
**セキュリティに関する注意**: `.env` ファイルは絶対にバージョン管理システムにコミットしないでください。

1.  サンプル環境設定ファイルをコピーします:
    ```bash
    cp .env.example .env
    ```
2.  `.env` ファイルを開き、設定を編集します:
    ```ini
    PORT=3000
    APP_TITLE=Godot Build Manager
    ```

#### 4. 実行
サーバーを起動します:
```bash
npm start
```
アプリケーションは `http://localhost:3000` で利用可能です。
