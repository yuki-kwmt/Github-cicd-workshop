---
name: create-pr
description: "現在のブランチ、リポジトリのブランチ戦略、差分、コミット、Issue から適切なベースとヘッドを判断し、Pull Request を安全に作成します。変更の統合を提案するときに使います。"
user-invocable: true
disable-model-invocation: true
---

# Pull Request を作成する

この Skill は引数なしの `/create-pr` で使用します。現在の文脈から Pull Request の目的を判断し、リポジトリの Git 運用方針に従ってください。

## 文脈を確認する

1. 現在のリポジトリ、ブランチ、作業ツリー、remote、upstream、既定ブランチを確認します。
2. 現在のブランチをヘッドとします。リポジトリの設定、`AGENTS.md`、`git-workflow` Skill、既存の Pull Request を確認し、統合先のベースを判断します。
3. このスターターの標準的な対応は次のとおりです。
   - `feature/<Issue番号>-<説明>` から作成する場合: ベースは `develop`
   - `develop` から作成する場合: ベースは `main`
4. 現在のブランチが `main`、detached HEAD、または標準的な対応にない場合は、Pull Request を作成せず、`askQuestions` でベースと目的を確認します。
5. 作業ツリーが clean であり、ヘッドがリモートへ push 済みであることを確認します。満たさない場合は作成せず、必要な対応を説明します。

## Pull Request の内容を組み立てる

1. ベースとヘッドの差分、コミット、関連する Issue、ヘッドに取り込まれた Pull Request を確認します。
2. feature ブランチでは、ブランチ名の Issue 番号から `gh issue view` で Issue を取得します。
3. `develop` では、差分と統合済み Pull Request から今回のリリースに含まれる Issue を特定します。一意に判断できない場合は `askQuestions` で確認します。
   - 同じチャットに `/prepare-release` の `Ready` 判定がある場合は、そのリリース対象、関連 Issue、品質ゲートを引き継いで再確認します。
   - `Ready` 判定がない場合や、判定後に `develop` が更新されている場合は、Pull Request を作成する前に `prepare-release` と同等の確認を行います。
   - リリース準備が `Blocked` の場合は Pull Request を作成しません。
4. リポジトリで定義されたテストとビルドを実行します。このスターターでは `npm test` と `npm run build` を使用します。
5. 実際の差分に基づいてタイトルと本文を作成します。
6. 本文には変更概要、検証結果、Issue との関連を含めます。確認していないテスト結果を成功として記載しません。
7. Issue の参照方法は、取得した既定ブランチとベースを厳密に比較して決定します。
   - ベースが既定ブランチではない場合: `Related to #<Issue番号>` と記載します。この Pull Request のマージでは Issue は自動で閉じません。
   - ベースが既定ブランチであり、マージによって Issue の完了条件を満たす場合: `Closes #<Issue番号>` と記載します。
   - ベースが既定ブランチの場合、`Refs` や `Related to` を `Closes` の代わりに使用しません。
   - `Closes` を使用できるか判断できない場合は、Pull Request を作成せず `askQuestions` で確認します。
8. 同じベースとヘッドの未完了 Pull Request があるか確認します。既にある場合は新規作成せず、その URL を示します。

## 作成する

1. 作成前に目的、タイトル、本文、ベース、ヘッド、関連 Issue を要約します。
2. Pull Request を1件作成します。
3. 作成後に URL、ベース、ヘッド、本文、関連 Issue を確認します。
4. ベースが既定ブランチの場合は、`gh pr view <Pull Request番号> --json closingIssuesReferences` などを使い、対象 Issue が自動クローズ対象として認識されていることを確認します。
5. 自動クローズ対象として認識されていない場合は成功として報告せず、Pull Request 本文と Issue の関係を修正する前にユーザーへ確認します。
6. 確認した URL、ベース、ヘッド、関連 Issue、自動クローズの有無を報告します。

## 停止条件

- 作業ツリーが clean でない
- ヘッドがリモートへ push されていない
- ベース、ヘッド、目的、関連 Issue を一意に判断できない
- 同じベースとヘッドの未完了 Pull Request が既にある
- ベースとヘッドの間に差分がない

停止条件に該当した場合は Pull Request を作成せず、必要な対応を説明または質問します。ファイル変更、コミット、push、merge は行いません。
