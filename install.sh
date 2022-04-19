#!/bin/bash -e

# FAL+ easy installer

pushd /tmp >/dev/null
curl -o fui.json -sS -H 'Accept: application/vnd.github.v3+json' 'https://api.github.com/repos/piclane/FoltiaUI/releases/latest'
DOWNLOAD_URL="$(grep '"browser_download_url"' fui.json | sed -E -e 's/^.*"(https:[^"]+)"$/\1/')"
VERSION="$(grep '"tag_name"' fui.json | sed -E -e 's/^.*"tag_name": "v([^"]+)".*$/\1/')"
\rm -f fui.json

curl -L -o fui.tar.gz "${DOWNLOAD_URL}"
tar zxf fui.tar.gz
\rm -f fui.tar.gz
cd "foltia_ui-${VERSION}"
su -c "$(pwd)/install.sh" -
popd >/dev/null
