---
title: Google Apps Script で使える OAuth トークンの権限設定の方法
---

## はじめに

Google Apps Script から Google AdManager へ API リクエストを実行したかったので、その際に設定した権限の設定方法をメモ。

## 設定方法

`appscript.json` に `oauthScopes` を設定すると、スクリプトで必要な権限を定義できます。

```diff
  {
    "timeZone": "Asia/Tokyo",
    "dependencies": {},
    "exceptionLogging": "STACKDRIVER",
-   "runtimeVersion": "V8"
+   "runtimeVersion": "V8",
+   "oauthScopes": [
+     "https://www.googleapis.com/auth/spreadsheets",
+     "https://www.googleapis.com/auth/script.external_request",
+     "https://www.googleapis.com/auth/dfp"
+   ]
  }
```

権限の値（大体がURLの形式っぽい）は各サービスのドキュメントに書いてあると思います。
Google AdManager は [Ad Manager API](https://developers.google.com/ad-manager/api/authentication#scope) のページに書いてありました。

## OAuth （アクセス）トークンの取得方法

`ScriptApp.getOAuthToken()` で取得できます。

```javascript
const accessToken = ScriptApp.getOAuthToken();

const response = UrlFetchApp.fetch("https://xxxxxxxxxxxxxxxxxx", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
  muteHttpExceptions: true,
});
```

## メモ

どうやってやるのか調べている時に [googleworkspace/apps-script-oauth2](https://github.com/googleworkspace/apps-script-oauth2) を読んでいたら、特別なことはしなくてもマニフェスト（clasp で管理している `appsscript.json`）設定して `ScriptApp.getOAuthToken()` すれば OAuth トークンは取れるぞ、とあったのでこれで十分でした。

> Then use the method [ScriptApp.getOAuthToken()](https://developers.google.com/apps-script/reference/script/script-app#getoauthtoken) in your code to access the OAuth2 access token the script has acquired and pass it in the Authorization header of a UrlFetchApp.fetch() call.
> 
> [README](https://github.com/googleworkspace/apps-script-oauth2/blob/67cae4034d0936dbe90b95f74cddd1ad35d799fd/README.md#connecting-to-a-google-api)
