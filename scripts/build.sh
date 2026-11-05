#!/bin/sh
# 公開用ファイルを dist/ に作成し、Web3Formsのアクセスキーを環境変数から差し込む。
# リポジトリ内の index.html にはプレースホルダー（__WEB3FORMS_ACCESS_KEY__）のみを置く。
set -eu

cd "$(dirname "$0")/.."

if [ -z "${WEB3FORMS_ACCESS_KEY:-}" ]; then
  echo "エラー: 環境変数 WEB3FORMS_ACCESS_KEY が設定されていません。" >&2
  exit 1
fi

case "$WEB3FORMS_ACCESS_KEY" in
  *[!0-9A-Za-z-]*)
    echo "エラー: WEB3FORMS_ACCESS_KEY に想定外の文字が含まれています。" >&2
    exit 1
    ;;
esac

rm -rf dist
mkdir -p dist
cp index.html dist/
cp -R assets dist/

sed "s/__WEB3FORMS_ACCESS_KEY__/${WEB3FORMS_ACCESS_KEY}/" index.html > dist/index.html

echo "dist/ を作成しました。"
