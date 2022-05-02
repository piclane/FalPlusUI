FalPlusUI
----
[Foltia ANIME LOCKER](https://foltia.com/ANILOC/) 用の拡張 UI

## 提供機能

このパッケージは以下の拡張機能を提供します。

- React / Material UI による令和感ある UI
  - 便利良さそうなフィルタ機能
  - それっぽくなった再生画面
  - 録画一覧の無限スクロール機能
- スマホ対応 (以下は確認済)
  - iPhone 12
- タブレット対応 (以下は確認済)
  - iPad mini
- 連続再生機能
- まとめて録画お掃除機能
- 画面
  - 録画一覧画面
  - 録画詳細画面
  - 動画プレイヤー画面
  - 録画お掃除画面

## スクリーンショット

![スクリーンショット](doc/images/screenshot.jpg)

## これから提供したい機能

- 動画アップロード機能
- ライブ機能

## インストール方法

### インストール

Foltia ANIME LOCKER に foltia ユーザーでログインした後、以下のコマンドを実行して下さい。
```bash
$ curl -SsL 'https://raw.githubusercontent.com/piclane/FalPlusUI/develop/easy_install.sh' | bash
```

上記の方法が上手く行かない場合は以下を試してみて下さい。
```bash
$ curl -L -# -o /tmp/fui.tar.gz "$(curl -sS -H 'Accept: application/vnd.github.v3+json' 'https://api.github.com/repos/piclane/FalPlusUI/releases/latest' | grep '"browser_download_url"' | sed -E -e 's/^.*"(https:[^"]+)"$/\1/')"
$ cd /tmp
$ tar zxf fui.tar.gz
$ rm fui.tar.gz
$ cd fal-plus-ui-<version>
$ su -c "$(pwd)/install.sh" -
```

### アンインストール

Foltia ANIME LOCKER に foltia ユーザーでログインした後、以下のコマンドを実行して下さい。
```bash
$ cd /tmp/fal-plus-ui-<version>
$ su -c "$(pwd)/uninstall.sh" -
```
