#!/bin/bash -e

title() {
  printf "\n\e[36m%s\e[0m\n\n" "$*"
}

echo '  _____     _ _   _       _   _ ___ '
echo ' |  ___|__ | | |_(_) __ _| | | |_ _|'
echo ' | |_ / _ \| | __| |/ _` | | | || | '
echo ' |  _| (_) | | |_| | (_| | |_| || | '
echo ' |_|  \___/|_|\__|_|\__,_|\___/|___|'
echo

# FAL+ easy installer

pushd /tmp >/dev/null
curl -o fui.json -sS -H 'Accept: application/vnd.github.v3+json' 'https://api.github.com/repos/piclane/FoltiaUI/releases/latest'
DOWNLOAD_URL="$(grep '"browser_download_url"' fui.json | sed -E -e 's/^.*"(https:[^"]+)"$/\1/')"
VERSION="$(grep '"tag_name"' fui.json | sed -E -e 's/^.*"tag_name": "v([^"]+)".*$/\1/')"
\rm -f fui.json

title 本体をダウンロードしています...
curl -L -# -o fui.tar.gz "${DOWNLOAD_URL}"
tar zxf fui.tar.gz
\rm -f fui.tar.gz
cd "foltia_ui-${VERSION}"

title インストールを開始します...
if ! su -c "$(pwd)/install.sh" - ; then
  echo
  echo 自動インストールに失敗しました。
  echo 以下のコマンドを実行してインストールを続行してください。
  echo
  echo 'su -c "'"$(pwd)"'/install.sh"'
  echo
  popd >/dev/null
  exit 2
fi
popd >/dev/null
