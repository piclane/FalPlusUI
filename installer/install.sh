#!/bin/bash -e

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE:-$0}")"; pwd)
TARGET_API_VERSION="1.0.3"
TARGET_DIR="/home/foltia"

# API のバージョンを取得
API_VERSION="$(curl -Ss http://localhost:8080/actuator/info | sed -E -e 's/^.*"version":"([^"]+)".*$/\1/')"
if [ "$API_VERSION" == "" ] ; then
  API_VERSION="0.0.0"
fi

# API の更新
if [ "$API_VERSION" != "$TARGET_API_VERSION" ] && \
   [ "$(printf '%s\n%s' "$API_VERSION" "$TARGET_API_VERSION" | sort -Vr | head -n 1)" == "$TARGET_API_VERSION" ] ; then
  curl -L -o /tmp/fapi.tar.gz "$(curl -sS -H 'Accept: application/vnd.github.v3+json' 'https://api.github.com/repos/piclane/FoltiaApi/releases/latest' | grep '"browser_download_url"' | sed -E -e 's/^.*"(https:[^"]+)"$/\1/')"
  pushd /tmp >/dev/null
  tar zxf fapi.tar.gz
  rm fapi.tar.gz
  cd "$(find . -name 'foltia_api-*' | sort -Vr | head -n 1)"
  ./install.sh
  popd >/dev/null
fi

# FAL+ インストール
rm -rf "${TARGET_DIR}/falp"
mv "$SCRIPT_DIR/falp" "${TARGET_DIR}/falp"
chown -R foltia. "${TARGET_DIR}/falp"
chmod 755 "${TARGET_DIR}/falp"

# httpd の設定
cp "${SCRIPT_DIR}/conf/falp.conf" "/etc/httpd/conf.d/falp.conf"
chmod 644 "/etc/httpd/conf.d/falp.conf"
service httpd reload

# index.html 修正
pushd "${TARGET_DIR}/php" >/dev/null
cat index.html \
| grep -v '<!-- FALP -->' \
| sed -E -e 's!</ul>!<\!-- FALP --><li><a href="/falp/"><img src="/images/top/btn_falp.png" alt="FAL+" class="hover" /></a></li>\n</ul>!' \
> index.html.new
chown foltia. index.html.new
chmod 644 index.html.new
\mv -f index.html.new index.html
popd >/dev/null

# foltialib.php 修正
pushd "${TARGET_DIR}/php/phpcommon" >/dev/null
cat foltialib.php \
| grep -v '<!-- FALP -->' \
| tr '\n' '\0' \
| sed -E -e 's!</ul>\x00<\!-- /id=gnavi/end -->!<\!-- FALP --><li><a href="/falp/"><img src="/images/gnavi/gnavi08.png" alt="FAL+" /></a></li>\n</ul>\n<\!-- /id=gnavi/end -->!' \
| tr '\0' '\n' \
> foltialib.php.new
chown foltia. foltialib.php.new
chmod 644 foltialib.php.new
\mv -f foltialib.php.new foltialib.php
popd >/dev/null

# 画像のコピー
## btn_falp.png
cp "${SCRIPT_DIR}/images/btn_falp.png" "${TARGET_DIR}/php/images/top/btn_falp.png"
cp "${SCRIPT_DIR}/images/btn_falp_on.png" "${TARGET_DIR}/php/images/top/btn_falp_on.png"
chown foltia. "${TARGET_DIR}"/php/images/top/*.png
chmod 644 "${TARGET_DIR}"/php/images/top/*.png

## gnavi08.png
cp "${SCRIPT_DIR}/images/gnavi08.png" "${TARGET_DIR}/php/images/gnavi/gnavi08.png"
cp "${SCRIPT_DIR}/images/gnavi08_on.png" "${TARGET_DIR}/php/images/gnavi/gnavi08_on.png"
chown foltia. "${TARGET_DIR}"/php/images/gnavi/*.png
chmod 644 "${TARGET_DIR}"/php/images/gnavi/*.png

echo 'Well done🍺'
echo ''
