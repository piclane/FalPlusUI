#!/bin/bash -ex

TARGET_DIR="/home/foltia"

# 画像の削除
\rm -f "${TARGET_DIR}/php/images/top/btn_falp.png"
\rm -f "${TARGET_DIR}/php/images/top/btn_falp_on.png"
\rm -f "${TARGET_DIR}/php/images/gnavi/gnavi07.png"
\rm -f "${TARGET_DIR}/php/images/gnavi/gnavi07_on.png"

# foltialib.php を元に戻す
pushd "${TARGET_DIR}/php/phpcommon" >/dev/null
cat foltialib.php \
| grep -v '<!-- FALP -->' \
> foltialib.php.new
chown foltia. foltialib.php.new
chmod 644 foltialib.php.new
\mv -f foltialib.php.new foltialib.php
popd

# index.html を元に戻す
pushd "${TARGET_DIR}/php" >/dev/null
cat index.html \
| grep -v '<!-- FALP -->' \
> index.html.new
chown foltia. index.html.new
chmod 644 index.html.new
\mv -f index.html.new index.html
popd

# httpd の設定を元に戻す
\rm -f /etc/httpd/conf.d/falp.conf
service httpd reload

# FAL+ アンインストール
rm -rf "${TARGET_DIR}/falp"

echo 'Well done🍺'
echo ''
