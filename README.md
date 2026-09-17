# Community Events - GitHub CI/CD スターター

Issue、ブランチ、Pull Request、CI、GitHub Pages CD を一巡するための小さな Vite アプリです。実在の組織、イベント、アカウントは使用していません。

## 前提条件

- Git
- Node.js 22 LTS
- npm
- GitHub Actions と GitHub Pages を利用できる GitHub リポジトリ

## ローカルで確認する

### PowerShell

```powershell
# 依存関係をインストールします
npm install

# Vitest のテストを実行します
npm test

# Vite アプリを本番用にビルドします
npm run build

# Vite の開発サーバーを起動します
npm run dev
```

### Bash

```bash
# 依存関係をインストールします
npm install

# Vitest のテストを実行します
npm test

# Vite アプリを本番用にビルドします
npm run build

# Vite の開発サーバーを起動します
npm run dev
```

開発サーバーを終了するには `Ctrl+C` を押します。`npm run build` の出力先は `dist/` です。

## GitHub Copilot の Skill

Visual Studio Code の Chat ビューを Agent モードで開きます。本ハンズオンでは、スターターに含まれる Skill のうち、次の slash command を使用します。

- `/implement-issue <Issue番号>`: Issue の要件を確認し、必要な質問、テストの追加、実装、検証を順に行います。
- `/review-changes`: 現在の Git 差分を読み、コミット前のセルフレビューを行います。
- `/prepare-release`: `develop` の同期状態、リリース対象、関連 Issue、品質ゲートを確認し、`main` 向け Pull Request を作成できる状態か判定します。
- `/create-pr`: 現在のブランチとリポジトリの運用方針からベース、ヘッド、関連 Issue を判断し、Pull Request を作成します。
- `/review-pr <Pull Request番号>`: 指定された Pull Request の CI、差分、コミット、関連 Issue を、ローカルブランチに依存せず読み取り専用でレビューします。

Git 操作を依頼した場合は、ブランチ戦略、コミット、push、Pull Request の共通方針をまとめた `git-workflow` Skill が必要に応じて参照されます。

## Issue シナリオ

リポジトリ作成後、**Issues** から「小規模な変更」テンプレートを選択します。

> 残席が3席以下のイベントを分かりやすくする

完了条件はテンプレートに記載されています。主な変更対象は `src/availability.js` と `src/availability.test.js` です。まずテストを追加し、失敗を確認してから実装を変更します。

## ブランチと Pull Request の流れ

Issue 番号が `1` の例です。

### PowerShell

```powershell
# main から develop ブランチを作成して切り替えます
git switch -c develop

# develop ブランチをリモートへ初回 push し、追跡先に設定します
git push -u origin develop

# develop から feature ブランチを作成して切り替えます
git switch -c feature/1-low-availability
```

### Bash

```bash
# main から develop ブランチを作成して切り替えます
git switch -c develop

# develop ブランチをリモートへ初回 push し、追跡先に設定します
git push -u origin develop

# develop から feature ブランチを作成して切り替えます
git switch -c feature/1-low-availability
```

1. `feature/1-low-availability` でコードとテストを変更し、push します。
2. `feature/1-low-availability` から `develop` への Pull Request を作成します。
3. CI とレビューを確認し、マージコミットで `develop` へマージします。
4. `develop` から `main` への Pull Request を作成します。
5. CI とレビューを確認し、マージコミットで `main` へマージします。
6. `main` への push で GitHub Pages workflow が実行されます。

## GitHub Pages の設定

リポジトリの **Settings > Pages > Build and deployment > Source** で **GitHub Actions** を選択します。`vite.config.js` の `base: './'` により、ユーザーサイトと任意の名前のプロジェクトサイトのどちらでも静的アセットを相対 URL で参照できます。

Pages workflow は次の公式アクションを使用します。

- `actions/configure-pages@v6`
- `actions/upload-pages-artifact@v5`
- `actions/deploy-pages@v5`

Secrets は不要です。

## トラブルシュート

- `npm ci` が lock file の不一致で失敗する: ローカルでは `npm install` を実行して `package-lock.json` を更新し、その変更もコミットします。
- Node.js の要件エラーが出る: `node --version` を確認し、Node.js 22 を使用します。
- Pages が `404` になる: Pages の Source が **GitHub Actions** であることと、`Deploy GitHub Pages` workflow の `deploy` job が成功していることを確認します。
- CI が動かない: Pull Request のベースが `develop` または `main` であること、Actions がリポジトリで許可されていることを確認します。
- `develop` が Pull Request の選択肢にない: `git push -u origin develop` を先に実行します。
