#!/bin/bash -ex

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE:-$0}")"; pwd)
VERSION="$(yarn versions | grep 'foltia_ui:' | sed -E -e "s/^.*foltia_ui: '([^']+)'.*$/\1/")"
DEST_DIR="${SCRIPT_DIR}/dist/foltia_ui-${VERSION}"
rm -rf "${DEST_DIR}"
mkdir -p "${DEST_DIR}"

# まずはビルド
yarn build
mv "${SCRIPT_DIR}/build/" "${DEST_DIR}/falp"

# installer ディレクトリの中身をコピー
cp -a "${SCRIPT_DIR}/installer/"* "${DEST_DIR}"

# 固める
pushd "${SCRIPT_DIR}/dist" >/dev/null
tar -zcf "${SCRIPT_DIR}/dist/foltia_ui-${VERSION}-noarch.tar.gz" "$(basename "${DEST_DIR}")"
