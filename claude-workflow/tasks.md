# TOMITA LAB LP（tomita-lab-website）タスクチェックリスト

> 参照: 要件定義書.md（Git管理外）

## 次回の再開手順（2026-11-06 時点）

**現状**: GitHub Pages で公開中（https://naokitotomita.github.io/tomita-lab/ ）。お問い合わせフォームは Web3Forms 経由で送信・受信できることを確認済み。

1. `preview-v2/`（Git管理外）の内容を本番に反映するか、ユーザーに確認する
2. 公開の仕組み（下記）を変えないこと。`main` へのプッシュがそのまま本番公開になる

## 公開の仕組み
- `index.html` の `access_key` はプレースホルダー `__WEB3FORMS_ACCESS_KEY__` のみ。本物のキーをリポジトリに書かない
- `main` へプッシュすると、`.github/workflows/deploy.yml` が `scripts/build.sh` を実行する。Actions Secrets の `WEB3FORMS_ACCESS_KEY` を差し込んだ `dist/` を GitHub Pages に公開する
- ローカルで確認するときは、シークレットフォルダの `.env` を読み込んでから `sh scripts/build.sh` を実行し、`dist/` を開く（`dist/` は .gitignore 済み）

## 完了したこと
- [x] LP の初版（2026-08-27）
- [x] 太字タイポグラフィとスクロールアニメーションでのリデザイン（2026-10-25）
- [x] Web3Forms キーの直書きをやめ、ビルド時に差し込む方式に変更（2026-11-05）
- [x] GitHub Actions 経由の Pages 公開に切り替え（2026-11-05）
- [x] フォームの受信確認（2026-11-06）

## 判断の記録
- 2026-11-05: 古いキーは過去コミット `0fb498f` に残っているが、Web3Forms のキーは公開前提のため履歴の書き換えはしない
- 2026-11-05: 重複していた `tsumugidoki-websiteのコピー/` を削除

## トラブル時のメモ
- 「問い合わせメールが届かない」ときは、まず Gmail で `in:anywhere from:web3forms.com` を検索する（2026-11-06 は迷惑メールに振り分けられていた。Web3Forms の Submissions に記録があれば、送信自体は成功している）
- Web3Forms の「Linked Emails」は追加の届け先用。アカウント本人のアドレスは登録しなくてよい

## バックログ（今後の候補）
- [ ] `preview-v2/` の内容を本番に反映するか判断する
- [ ] 紹介ツールの「Coming Soon」枠を、ツール完成後に差し替える
- [ ] SNSリンクの追加（フッターに TODO あり）
