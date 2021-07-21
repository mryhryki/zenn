---
title: "CloudFront のログを JS (TS) で分析する"
emoji: "🔍"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["JavaScript", "TypeScript", "AWS", "CloudFront"]
published: false
---



# はじめに

CloudFront のログを解析して、リクエストされたパスごとの転送容量を出したい、という場面があったので、その時にやったことのメモです。
半分は備忘録として、半分は誰かやってみたい人もいるかも、と思ったので書き残しておこうと思った次第です。



# CloudFront のログ

CloudFront で設定しておけば、S3バケットに出力されます。

詳しくはこちらの公式ドキュメントをご覧ください。
https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/AccessLogs.html



# リポジトリ

こちらにソースコードはおいています。
https://github.com/mryhryki/cloudfront-log-parser

こんなことをしています。

1. ログをS3からダウンロード
1. ログ ( `*.gz` ) を解凍して、１行ずつ JS のオブジェクトに変換
1. 任意の処理で１行ごとになんらかの集計処理（※）
1. 集計結果をファイル出力

※ソースコードをいじって自由に集計するようにしています。

肝は CloudFront のログの値を定義した [このあたり](https://github.com/mryhryki/cloudfront-log-parser/blob/d336afa292f19fe891a31ae9e1ed1d796898e6de/src/log.ts#L6-L40) にあると思います。
（今思うと、数値系は `number` 型にしても良かったな・・・）

```typescript
export interface LogLine {
  date: string; // イベントが発生した日付。YYYY-MM-DD 形式です。
  time: string; // CloudFront サーバーがリクエストへの対応を完了した時刻 (UTC) (01:42:39 など)
  xEdgeLocation: string; // リクエストを処理したエッジロケーション。通常、エッジロケーションの地理的場所の近くにある空港の、国際航空運送協会 (IATA) の空港コードに対応します。
  scBytes: string; // サーバーがリクエストに応じてビューワーに送信したデータ (ヘッダーを含む) のバイトの合計数。
  cIp: string; // リクエスト元のビューワーの IP アドレス (192.0.2.183 または 2001:0db8:85a3:0000:0000:8a2e:0370:7334 など)。
  csMethod: string; // ビューワーから受信した HTTP リクエストメソッド。
  csHost: string; // CloudFront ディストリビューションのドメイン名 (d111111abcdef8.cloudfront.net など)。
  csUriStem: string; // パスとオブジェクトを識別するリクエスト URL の部分 (/images/cat.jpg など)。URL 内の疑問符 (?) およびクエリ文字列はログに含まれません。
  scStatus: string; // サーバーのレスポンスの HTTP ステータスコード (例: 200)。000は、サーバーがリクエストに応答する前に、ビューワーが接続を閉じたことを示します。
  csReferer: string; // リクエスト内の Referer ヘッダーの値。
  csUserAgent: string; // クエスト内の User-Agent ヘッダーの値。
  csUriQuery: string; // リクエスト URL のクエリ文字列の部分 (ある場合)。URL にクエリ文字列が含まれない場合、このフィールドの値はハイフン (-) です。
  csCookie: string; // 名前と値のペアおよび関連属性を含む、リクエスト内の Cookie ヘッダー。
  xEdgeResultType: string; // サーバーが、最後のバイトを渡した後で、レスポンスを分類した方法。
  xEdgeRequestId: string; // リクエストを一意に識別する不透明な文字列。CloudFront では、この文字列を x-amz-cf-id レスポンスヘッダーでも送信します。
  xHostHeader: string; // ビューワーが、このリクエストの Host ヘッダーに追加した値。
  csProtocol: string; // ビューワーリクエストのプロトコル (http、https、ws、wss のいずれか)。
  csBytes: string; // ビューワーがリクエストに含めたデータ (ヘッダーを含む) のバイトの合計数。
  timeTaken: string; // サーバーが、ビューワーのリクエストを受信してからレスポンスの最後のバイトを出力キューに書き込むまでの秒数。サーバーで 1000 分の 1 秒単位まで測定されます (例: 0.082)。
  xForwardedFor: string; // ビューワーが HTTP プロキシまたはロードバランサーを使用してリクエストを送信した場合、c-ip フィールドの値はプロキシまたはロードバランサーの IP アドレスです。
  sslProtocol: string; // リクエストが HTTPS を使用した場合、このフィールドには、リクエストとレスポンスを送信するためにビューワーとサーバーがネゴシエートした SSL/TLS プロトコルが含まれます。
  sslCipher: string; // リクエストが HTTPS を使用した場合、このフィールドには、リクエストとレスポンスを暗号化するためにビューワーとサーバーがネゴシエートした SSL/TLS 暗号が含まれます。
  xEdgeResponseResultType: string; // ビューワーにレスポンスを返す直前にサーバーがレスポンスを分類した方法
  csProtocolVersion: string; // ビューワーがリクエストで指定した HTTP バージョン。指定できる値には、HTTP/0.9、HTTP/1.0、HTTP/1.1、および HTTP/2.0 などがあります。
  fleStatus: string; // フィールドレベル暗号化がディストリビューション用に設定されている場合、このフィールドにはリクエストボディが正常に処理されたかどうかを示すコードが含まれます。
  fleEncryptedFields: string; // サーバーが暗号化してオリジンに転送したフィールドレベル暗号化フィールドの数。
  cPort: string; // 閲覧者からのリクエストのポート番号。
  timeToFirstByte: string; // サーバー上で測定される、要求を受信してから応答の最初のバイトを書き込むまでの秒数。
  xEdgeDetailedResultType: string; // x-edge-totalBytesPerPath-type フィールドが Error でない場合、このフィールドには x-edge-totalBytesPerPath-type と同じ値が含まれます。
  scContentType: string; // レスポンスの HTTP Content-Type ヘッダーの値。
  scContentLen: string; // レスポンスの HTTP Content-Length ヘッダーの値。
  scRangeStart: string; // レスポンスに HTTP Content-Range ヘッダーが含まれている場合、このフィールドには範囲の開始値が含まれます。
  scRangeEnd: string; // レスポンスに HTTP Content-Range ヘッダーが含まれている場合、このフィールドには範囲の終了値が含まれます。
}
```

`xEdgeLocation` で CloudFront のエッジロケーションも分かるんですね。知らなかった・・・。
よく見ると、HTTPレスポンスヘッダー (`x-amz-cf-pop`) にも入っている値のようでした。



# 動かしてみる

サンプルとして、パスごとに転送容量を出してトップ10を出してみました。
`src/config.ts` を以下のようにするとできます。

```typescript
// (省略)

/**
 * 集計結果の型定義
 */
export interface ParseResult {
  [path: string]: /* transfer bytes */number
}

/**
 * パースしたログデータに１行単位で処理をするための関数
 *
 * ここに集計処理を入れて `parseResult` に値をセットする
 *
 * @param logLine １行単位でパースしたログデータ
 * @param result 集計結果（必要に応じて直接内容を編集する）
 */
export const parseLogLine = (logLine: LogLine, result: ParseResult): void => {
  // パスごとの転送容量をカウントする
  const { csUriStem, scBytes } = logLine;
  result[csUriStem] ??= 0;
  result[csUriStem] += parseInt(scBytes, 10);
};

/**
 * 集計結果の編集
 *
 * ここでデータの整形や形式の変更、フィルタリングやソートなど必要な処理があれば実行する。
 * null を返却するとファイル出力されません。
 *
 * @param result 集計結果
 * @return 最終的な出力内容
 */
export const editResult = (result: ParseResult): any => {
  const list = Object.entries(result).map(([path, bytes]) => ({ path, bytes }));
  list.sort((a, b) => a.bytes - b.bytes);
  return list.slice(0, 10).map(({path, bytes}) => `${path/* マスク処理→ */.substr(0, 20).replace(/[0-9a-z]/g, 'x')}: ${bytes} bytes`)
};
```

こんな感じで出力されます。
（※パスはマスクしてます）

```json
[
  "/xxxxxxxx-xxxx-xxxx-: 568693829882 bytes",
  "/xxxxxxxx-xxxx-xxxx-: 541964171803 bytes",
  "/xxxxxxxx-xxxx-xxxx-: 518134426473 bytes",
  "/xxxxxxxx-xxxx-xxxx-: 490825622240 bytes",
  "/xxxxxxxx-xxxx-xxxx-: 473513849967 bytes",
  "/xxxxxxxx-xxxx-xxxx-: 468236669651 bytes",
  "/xxxxxxxx-xxxx-xxxx-: 464903266405 bytes",
  "/xxxxxxxx-xxxx-xxxx-: 463575051120 bytes",
  "/xxxxxxxx-xxxx-xxxx-: 463444828227 bytes",
  "/xxxxxxxx-xxxx-xxxx-: 458324231420 bytes"
]
```


PCのスペックによると思いますが、6,495ファイル（約2.85GB）の分析が約2分49秒かかりました。
（※予めファイルはダウンロードしていたので、この実行時間にS3からのダウンロード時間は含みません）

```
Parsed: 169.723 sec, 6495 files, 2854026489 bytes
```



# おわりに

少々定義は手間でしたが、やってみると以外に簡単にできました。
慣れた言語で書いておけば、簡単に色々分析できるので、割と面白かったです。

今回はパパっと集計したかったので JS (TS) でやりましたが、Go や Rust とかでやればもっと速くできるのかな・・・ 🤔
いつか気が向いたらやるかも。（たぶん、やらないと思います）
