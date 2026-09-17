---
name: prepare-release
description: "develop に統合された変更、関連する Pull Request と Issue、品質ゲートを確認し、main 向けリリース Pull Request を作成できる状態か判定します。リリース対象を確認するときに使います。"
user-invocable: true
disable-model-invocation: true
---

# リリースを準備する

この Skill は引数なしの `/prepare-release` で使用します。リリース対象を確認し、`Ready` または `Blocked` を報告します。Pull Request の作成やマージは行いません。

## 1. ブランチと作業ツリーを確認する

1. `git status --short --branch` で、現在のブランチと作業ツリーを確認します。
2. GitHub から既定ブランチを取得し、`main` であることを確認します。
3. 現在のブランチが `develop` であることを確認します。
4. upstream が `origin/develop` であることを確認します。
5. 未コミットの変更がある場合は、ファイルを変更せず `Blocked` として報告します。

前提を満たさない場合は、ブランチを自動で作成または切り替えず、必要な対応を説明して停止します。

## 2. リモートとの同期状態を確認する

1. `git fetch origin` でリモート追跡ブランチを更新します。
2. ローカルの `develop` と `origin/develop` を比較します。
3. 次のいずれかに該当する場合は `Blocked` として報告します。
   - ローカルの `develop` が遅れている
   - push されていないコミットがある
   - 履歴が分岐している
   - `origin/main` または `origin/develop` が存在しない

`git pull` や `git push` は自動実行しません。

## 3. リリース対象を確認する

1. `origin/main..origin/develop` のコミットを確認します。
2. `origin/main...origin/develop` の変更ファイルと差分の概要を確認します。
3. `develop` に統合された Pull Request と関連 Issue を確認します。
4. リリース対象がない場合や、無関係な変更、生成物、secret、意図を判断できないコミットがある場合は `Blocked` として報告します。
5. 関連 Issue が複数ある場合はすべて列挙します。Issue を一意に特定できない場合は `askQuestions` で確認し、回答を待ちます。
6. `main` 向け Pull Request で `Closes #<Issue番号>` を記載すべき Issue を明示します。

## 4. 品質ゲートを確認する

1. リポジトリで定義されている検証コマンドを確認します。
2. このスターターでは次を実行します。

   ```shell
   npm test
   npm run build
   ```

3. `develop` に対する直近の CI 結果も確認します。
4. ローカル検証または CI が失敗、未完了、未確認の場合は `Ready` と判定しません。
5. 実行していない検査を成功として報告しません。

## 5. 判定を報告する

次の形式で報告します。

```markdown
## リリース準備結果

- 判定: Ready または Blocked
- ベース: main
- ヘッド: develop
- 同期状態: 状態

### リリース対象

- コミット
- Pull Request
- Issue
- 変更ファイル

### 品質ゲート

- npm test
- npm run build
- develop の CI

### Issue の自動クローズ

- Closes #<Issue番号>

### ブロッカー

- なし、または解決が必要な項目
```

`Ready` の場合は、内容をユーザーが確認した後に `/create-pr` を使用するよう案内します。`Blocked` の場合は、解決方法を示しますが、自動では修正しません。

## 禁止事項

- ブランチの作成、切り替え、削除
- `git pull`、コミット、push、merge、rebase、reset
- ファイルの変更
- Issue や Pull Request の作成、編集、クローズ
- Workflow の再実行
