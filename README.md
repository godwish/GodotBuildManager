# GodotBuildManager

<p align="center">
  <img src="https://github.com/user-attachments/assets/5945ea5a-7bfd-44bb-9530-f0eef7daf11d" width="32%" />
  <img src="https://github.com/user-attachments/assets/f1faf1f1-e1a3-482b-818d-7fc49fd6d1a0" width="32%" />
  <img src="https://github.com/user-attachments/assets/937dd5f1-52a5-4781-ad97-9cd8618cc054" width="32%" />
</p>


A web-based tool for managing and distributing Godot game builds (Web and Android).

[English](#english) | [한국어](#한국어) | [日本語](#日本語)

---

## English

### Project Description
While testing a Godot build alone is straightforward, the repeated process of requesting tests and distributing versions can become exhausting for both developers and testers. 

This project is designed to solve that problem. Simply upload the version, description, and build files to deploy them immediately.

* **Supported Platforms**: Web and Android.
* **Web Builds**: Upload the build folder as a ZIP file.
* **Android Builds**: Upload the APK file directly.

**Pro-tip**: Including version information within your build will make it much easier to identify which version a bug occurred in and reproduce the issue later.

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

### 프로젝트 설명
Godot로 빌드를 뽑아서 혼자 테스트한다면 큰 문제가 없지만, 테스트를 요청하고 버전을 배포하는 과정이 반복되면 개발자와 테스터 모두에게 피곤한 상황이 됩니다.

이 프로젝트는 그런 번거로움을 해결하기 위해 만들어졌습니다. 버전, 설명, 배포용 빌드를 올리면 즉시 배포가 가능합니다.

* **지원 플랫폼**: 웹(Web) 및 안드로이드(Android).
* **웹 빌드**: 빌드 폴더를 ZIP으로 압축해서 업로드하세요.
* **안드로이드 빌드**: APK 파일을 그대로 업로드하세요.

**팁**: 빌드를 뽑으실 때 버전 정보를 포함하면, 추후 문제가 생겼을 때 어떤 빌드에서 발생했는지 파악하기 쉬워 문제를 재현하는 데 큰 도움이 됩니다.

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

### プロジェクト説明
Godotでビルドを作成し、一人でテストする分には大きな問題はありませんが、テストを依頼し、バージョンを配布する過程が繰り返されると、開発者とテスターの両方にとって疲弊する状況になります。

このプロジェクトは、そのような状況を解決するために作られました。バージョン、説明、配布用ビルドをアップロードすれば、すぐに配布が可能です。

* **サポートされているプラットフォーム**: ウェブ（Web）および Android。
* **ウェブビルド**: ビルドフォルダを ZIP 形式で圧縮してアップロードしてください。
* **Androidビルド**: APK ファイルをそのままアップロードしてください。

**ヒント**: ビルド時にバージョン情報を含めることで、後で問題が発生した際にどのビル드で問題が起きたのかを把握し、再現しやすくなります。

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

#### 2. イン스트ール
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
