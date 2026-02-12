# GodotBuildManager
A web-based tool for managing and distributing Godot game builds (Web and Android).

## Screenshot

<p align="center">
  <img src="https://github.com/user-attachments/assets/5945ea5a-7bfd-44bb-9530-f0eef7daf11d" width="32%" />
  <img src="https://github.com/user-attachments/assets/f1faf1f1-e1a3-482b-818d-7fc49fd6d1a0" width="32%" />
  <img src="https://github.com/user-attachments/assets/934dd5f1-52a5-4781-ad97-9cd8618cc054" width="32%" />
</p>




[English](#english) | [한국어](#한국어) | [日本語](#日本語)

---

## English

### Project Description
While testing a Godot build alone is straightforward, the repeated process of requesting tests and distributing versions can become exhausting for both developers and testers. 

This project is designed to solve that problem. Simply upload the version, description, and build files to deploy them immediately.

### ⚠️ Important Notes
* **HTTPS Required**: Due to Godot 4's engine requirements (SharedArrayBuffer), **Web builds will only run in an HTTPS environment.**
* **Access Control**: Management features (Upload and Delete buttons) are only visible when accessing from a **local network (192.168.*)**. External users will only have access to "Run" and "Download" features.

### Platform Support
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
1.  **Prerequisites**: Node.js (v14 or higher), npm.
2.  **Installation**: `npm install` after cloning.
3.  **Environment Setup**: Copy `.env.example` to `.env` and configure `PORT`.
4.  **Running**: `npm start` and visit `http://localhost:3000`.

---

## 한국어

### 프로젝트 설명
Godot로 빌드를 뽑아서 혼자 테스트한다면 큰 문제가 없지만, 테스트를 요청하고 버전을 배포하는 과정이 반복되면 개발자와 테스터 모두에게 피곤한 상황이 됩니다.

이 프로젝트는 그런 번거로움을 해결하기 위해 만들어졌습니다. 버전, 설명, 배포용 빌드를 올리면 즉시 배포가 가능합니다.

### ⚠️ 중요 사항
* **HTTPS 필수**: Godot 4 엔진 사양(SharedArrayBuffer 사용)으로 인해, **웹 빌드는 반드시 HTTPS 환경에서만 실행됩니다.**
* **접근 제어**: 업로드 및 삭제와 같은 관리 메뉴는 **내부망(192.168.*)** 접속 시에만 나타납니다. 외부 접속 시에는 관리 기능이 제한되며 빌드 실행 및 다운로드만 가능합니다.

### 지원 플랫폼
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
1.  **필수 조건**: Node.js (v14 이상), npm.
2.  **설치**: 클론 후 `npm install`.
3.  **환경 설정**: `.env.example`을 `.env`로 복사 후 `PORT` 등 설정.
4.  **실행**: `npm start` 후 `http://localhost:3000` 접속.

---

## 日本語

### プロジェクト説明
Godotでビルドを作成し、一人でテストする分には大きな問題はありませんが、テストを依頼し、バージョンを配布する過程が繰り返されると、開発者とテスターの両方にとって疲弊する状況になります。

このプロジェクトは、そのような状況を解決するために作られました。バージョン、説明、配布用ビルドをアップロードすれば、すぐに配布が可能です。

### ⚠️ 重要事項
* **HTTPS 必須**: Godot 4 のエンジン仕様 (SharedArrayBuffer) により、**ウェブビルドは HTTPS 環境でのみ動作します。**
* **アクセス制限**: アップロードや削除などの管理メニューは、**ローカルネットワーク (192.168.*)** からのアクセス時のみ表示されます。外部からアクセスした場合、管理機能は制限され、実行とダウンロードのみが可能です。

### サポートされているプラットフォーム
* **ウェブビル드**: ビルドフォルダを ZIP 形式で圧縮してアップロードしてください。
* **Androidビルド**: APK ファイルをそのままアップロードしてください。

**ヒント**: ビルド時にバージョン情報を含めることで、後で問題が発生した際にどのビルドで問題が起きたのかを把握し、再現しやすくなります。

### 사용 기술 / 使用技術
-   **ランタイム**: Node.js
-   **フレームワーク**: Express.js
-   **データベース**: SQLite (`better-sqlite3`)
-   **フロントエンド**: Vanilla HTML/CSS/JS
-   **その他**: Multer (ファイルアップロード), Adm-Zip (ZIP解凍)

### デプロイ方法
1.  **前提条件**: Node.js (v14以上), npm.
2.  **インストール**: クローン後 `npm install`.
3.  **環境設定**: `.env.example` を `.env` にコピーして設定.
4.  **実行**: `npm start` 後 `http://localhost:3000` にアクセス.
