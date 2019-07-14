# blogPushSlack

RSSのないブログの更新をGASを使ってSlackに通知する

# 使い方
## 事前準備
1. Slackの設定

- 新たにチャンネルを作成
https://user-images.githubusercontent.com/23024426/61186254-2bb77e00-a69e-11e9-9a5b-95d381cc39ca.png

- チャンネルの設定 → Add apps... → incoming-webhook をインストール
https://user-images.githubusercontent.com/23024426/61186287-66b9b180-a69e-11e9-894f-b12813b8cb14.png

- Add Configuration → Post Channel でチャンネルを設定
https://user-images.githubusercontent.com/23024426/61186270-4e499700-a69e-11e9-8434-8bce454d64e7.png
https://user-images.githubusercontent.com/23024426/61186318-c7e18500-a69e-11e9-9460-85c367361069.png

- 好きにintegrationのusernameを設定
https://user-images.githubusercontent.com/23024426/61186330-e6478080-a69e-11e9-8c21-31c18632af77.png

- `Webhook URL` をメモ
https://user-images.githubusercontent.com/23024426/61186348-07a86c80-a69f-11e9-9887-8ae87f66c347.png


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
https://user-images.githubusercontent.com/23024426/61186230-d4b1a900-a69d-11e9-9f59-15a40139dfe8.png

2. コードをコピーして貼り付け。
`main.js`のコードをコピーし、GASに貼り付け。

3. GAS でプロパティを設定する。
- GASのファイル → プロジェクトのプロパティ → スクリプトのプロパティを選択
- +行を追加 → 以下の2つを設定
  - 名前:SLACK_INCOMING_URL、値:`Webhook URL`
  - 名前:SHEET_ID、値:`<spreadsheet-id>
- 保存を押す


