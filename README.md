# blogPushSlack

RSSのないブログの更新をGASを使ってSlackに通知する

# 使い方
## 事前準備
1. Slackの設定
- 新たにチャンネルを作成
- チャンネルの設定 → Add apps... → incoming-webhook をインストール
- Add Configuration → Post Channel でチャンネルを設定
- 好きにintegrationのusernameを設定

`Webhook URL` をメモ

2. Google スプレッドシートを作成
- Googleスプレッドシートを作成、"メンバー", "最新ブログ"というシート(スプレッドシートの左下のやつ)を作成
- メンバーのシートにブログ更新を取得したい人の「名前(表示名)・リンク・ペンライトカラー(HEX)」を記入
- リンクは以下のようなリンク（最後の番号だけ異なる）
  - 名前の例 ばうちゃん
  - リンクの例 https://www.hinatazaka46.com/s/official/diary/member/list?ima=0000&ct=1
  - カラーの例 #F00000

URL https://docs.google.com/spreadsheets/d/<spreadsheet-id>/edit の `<spreadsheet-id>` の部分をメモ


## ブログ更新を自動取得する
1. Google Apps Script(GAS) を新規に作成する。
自身のGoogleDriveから新規作成 → その他 → Google Apps Script を選択。


2. コードをコピーして貼り付け。


3. GAS でプロパティを設定する。
- GASのファイル → プロジェクトのプロパティ → スクリプトのプロパティを選択
- +行を追加 → 以下の2つを設定
  - 名前:SLACK_INCOMING_URL、値:`Webhook URL`
  - 名前:SHEET_ID、値:`<spreadsheet-id>
- 保存を押す


