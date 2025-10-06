---
title: "\"CloudFront 経由で API Gateway を呼び出した場合のレスポンス時間の変化を調査する\""
emoji: "🔍"
type: "tech"
topics:
  - "AWS"
  - "APIGateway"
  - "CloudFront"
published: true
canonical: "https://zenn.dev/mryhryki/articles/2021-04-30-api-gateway-with-cloudfront"
---

# はじめに

API Gateway に対して、直接アクセスした場合と CloudFront 経由アクセスした場合に、レスポンス時間がどの様に変化するかを調査した記事です。

# API Gateway を CloudFront 経由でアクセスするパターン

私の場合は、静的リソースの配信 (S3) と、動的リソースの配信 (API Gateway) を同一ドメインで配信できるようにしたい、というのが目的です。
[Same-origin policy](https://developer.mozilla.org/ja/docs/Web/Security/Same-origin_policy) に起因する課題をそもそも起こさせないにはこの構成を試したい、という感じです。
CORSなどの色々設定しているのですが、そもそも同一ドメインでやれるほうが楽なので。



# 調査しようと思ったきっかけ

いくつかの記事を見かけたのですが、早くなる、遅くなるの両方の記事を見かけたので、自分で実際に環境を作って調べよう！と思ったのがきっかけです。

例えば、以下のような記事を見つけました。

> 2020/08/14現在、CloudFrontの接続ポイントは42か国84都市にある216箇所が提供されています。日本では大阪に1、東京に16箇所あります。接続ポイント以降の通信、つまりオリジンのAPI Gatewayまでの通信はAWSのバックボーンネットワークを使うので、通信の安定化、高速化が期待できます。

https://dev.classmethod.jp/articles/cloudfront-in-front-on-websocket-api-gateway/

> （もちろん、API Gateway内部にCloudFrontが暗黙的に使われており、多段CloudFrontになるため遅延が大きいというのは承知）

https://qiita.com/horsewin/items/3209083d9fb3a8441895



# 検証環境の構築

## 構成

以下の２つのパターンでレスポンス時間を計測しています。

1. 直接 API Gateway にアクセスし、Lambda からレスポンスを返すパターン
1. CloudFront 経由で API Gateway にアクセスし、Lambda からレスポンスを返すパターン

![image.png](https://i.gyazo.com/6ca3896cf1735e9f7db3a2b2428fba8b.png)

## 実験に使ったソースコード

https://github.com/mryhryki/example-api-gateway-with-cloudfront

以下２つのコードが入っています。

1. AWS環境を作る Terraform のソースコード
   - コマンド一発でAWSの環境構築ができるようになってます
1. 計測に使った TypeScript (Deno) のソースコード

## Lambda のソースコード

シンプルなソースコードになっています。

```javascript
const getRandom = () => `00000000${Math.round(Math.random() * 99999999)}`.substr(-8, 8)
const Lambda = getRandom()

exports.handler = async (_event, _context, callback) => callback(null, {
  statusCode: 200,
  body: JSON.stringify({lambda: Lambda, random: getRandom()})
})
```

以下の目的で２つの乱数を返しています。

1. `lambda`
    - 関数のインスタンスの起動時に決まる乱数
    - Lambda の関数インスタンスが同じであれば同じ値を返す
    - コールドスタート（≒ 関数インスタンスが変わる）の場合は大きくレスポンス時間に影響が出るので、同じ関数インスタンスから返しているかを確認する目的
2. `random`
    - 呼ばれるたびに値が変わる乱数
    - CloudFront の場合、キャッシュしてしまうと API Gateway にリクエストしないので、レスポンス時間に影響が出るので、毎回Lambdaにアクセスしているかを確認する目的



# 計測

## 計測方法

TypeScript のソースコードを [Deno](https://deno.land/) で動かして計測しています。
計測方法としては API Gateway に直接アクセスした場合と、CloudFront 経由でアクセスした場合、それぞれ100回ずつアクセスしてレスポンス時間をとり、平均レスポンス時間を算出しています。

詳しくは [ソースコード](https://github.com/mryhryki/example-api-gateway-with-cloudfront/blob/main/measure/index.ts) を参照してください。

## us-east-1 (バージニア) の結果

私が普段個人開発では us-east-1 (バージニア) をメイン使っているので、まずはこちらのリージョンで試してみました。

結果は平均すると、CloudFront 経由のほうが約 50ms 遅くなっています。

```
API Gateway average response time: 208.8 ms
CloudFront average response time: 253.98 ms
```

ただ、1つ一つの結果を見てみると平均値とは違う印象です。

:::details 詳細な結果

※フォーマットは `[実行回数] Res: [レスポンスコード] ([レスポンス時間] ms) [Lambda: [関数インスタンスを表す乱数], Random: [リクエストごとに変わる乱数]]` になっています。

```
$  deno run --allow-net --allow-read ./measure/datetime.ts

URL[https://r3hh44vkbc.execute-api.us-east-1.amazonaws.com/dev/example]
001 Res: 200 (280 ms) [Lambda: 26583923, Random: 14358241]
002 Res: 200 (214 ms) [Lambda: 26583923, Random: 15671095]
003 Res: 200 (223 ms) [Lambda: 26583923, Random: 11857141]
004 Res: 200 (225 ms) [Lambda: 26583923, Random: 94109937]
005 Res: 200 (229 ms) [Lambda: 26583923, Random: 86769141]
006 Res: 200 (218 ms) [Lambda: 26583923, Random: 07077613]
007 Res: 200 (216 ms) [Lambda: 26583923, Random: 68312065]
008 Res: 200 (203 ms) [Lambda: 26583923, Random: 24114674]
009 Res: 200 (223 ms) [Lambda: 26583923, Random: 23094042]
010 Res: 200 (213 ms) [Lambda: 26583923, Random: 69463940]
011 Res: 200 (217 ms) [Lambda: 26583923, Random: 22726782]
012 Res: 200 (215 ms) [Lambda: 26583923, Random: 20826837]
013 Res: 200 (218 ms) [Lambda: 26583923, Random: 43570511]
014 Res: 200 (203 ms) [Lambda: 26583923, Random: 47394027]
015 Res: 200 (232 ms) [Lambda: 26583923, Random: 54426570]
016 Res: 200 (208 ms) [Lambda: 26583923, Random: 87352194]
017 Res: 200 (214 ms) [Lambda: 26583923, Random: 78986461]
018 Res: 200 (199 ms) [Lambda: 26583923, Random: 94344232]
019 Res: 200 (214 ms) [Lambda: 26583923, Random: 29237716]
020 Res: 200 (231 ms) [Lambda: 26583923, Random: 26847112]
021 Res: 200 (208 ms) [Lambda: 26583923, Random: 74856873]
022 Res: 200 (203 ms) [Lambda: 26583923, Random: 69307735]
023 Res: 200 (212 ms) [Lambda: 26583923, Random: 99220155]
024 Res: 200 (203 ms) [Lambda: 26583923, Random: 49414052]
025 Res: 200 (207 ms) [Lambda: 26583923, Random: 15534111]
026 Res: 200 (201 ms) [Lambda: 26583923, Random: 27800764]
027 Res: 200 (209 ms) [Lambda: 26583923, Random: 82462962]
028 Res: 200 (216 ms) [Lambda: 26583923, Random: 88465611]
029 Res: 200 (204 ms) [Lambda: 26583923, Random: 97609450]
030 Res: 200 (199 ms) [Lambda: 26583923, Random: 70355387]
031 Res: 200 (212 ms) [Lambda: 26583923, Random: 16041832]
032 Res: 200 (205 ms) [Lambda: 26583923, Random: 00080199]
033 Res: 200 (223 ms) [Lambda: 26583923, Random: 80209813]
034 Res: 200 (201 ms) [Lambda: 26583923, Random: 49686034]
035 Res: 200 (202 ms) [Lambda: 26583923, Random: 28863799]
036 Res: 200 (210 ms) [Lambda: 26583923, Random: 96152361]
037 Res: 200 (203 ms) [Lambda: 26583923, Random: 69018328]
038 Res: 200 (201 ms) [Lambda: 26583923, Random: 53247389]
039 Res: 200 (195 ms) [Lambda: 26583923, Random: 19399107]
040 Res: 200 (212 ms) [Lambda: 26583923, Random: 79094009]
041 Res: 200 (231 ms) [Lambda: 26583923, Random: 31000777]
042 Res: 200 (203 ms) [Lambda: 26583923, Random: 61269069]
043 Res: 200 (204 ms) [Lambda: 26583923, Random: 06406197]
044 Res: 200 (209 ms) [Lambda: 26583923, Random: 31491647]
045 Res: 200 (205 ms) [Lambda: 26583923, Random: 94303746]
046 Res: 200 (201 ms) [Lambda: 26583923, Random: 75698451]
047 Res: 200 (207 ms) [Lambda: 26583923, Random: 72127658]
048 Res: 200 (199 ms) [Lambda: 26583923, Random: 50402009]
049 Res: 200 (201 ms) [Lambda: 26583923, Random: 40544705]
050 Res: 200 (205 ms) [Lambda: 26583923, Random: 52634780]
051 Res: 200 (202 ms) [Lambda: 26583923, Random: 97017312]
052 Res: 200 (210 ms) [Lambda: 26583923, Random: 34381796]
053 Res: 200 (197 ms) [Lambda: 26583923, Random: 94207600]
054 Res: 200 (210 ms) [Lambda: 26583923, Random: 85432200]
055 Res: 200 (195 ms) [Lambda: 26583923, Random: 76948582]
056 Res: 200 (194 ms) [Lambda: 26583923, Random: 69525583]
057 Res: 200 (217 ms) [Lambda: 26583923, Random: 82665653]
058 Res: 200 (204 ms) [Lambda: 26583923, Random: 22287230]
059 Res: 200 (196 ms) [Lambda: 26583923, Random: 94889558]
060 Res: 200 (215 ms) [Lambda: 26583923, Random: 75597810]
061 Res: 200 (195 ms) [Lambda: 26583923, Random: 81852398]
062 Res: 200 (204 ms) [Lambda: 26583923, Random: 61635906]
063 Res: 200 (194 ms) [Lambda: 26583923, Random: 17661171]
064 Res: 200 (216 ms) [Lambda: 26583923, Random: 40197644]
065 Res: 200 (198 ms) [Lambda: 26583923, Random: 14545660]
066 Res: 200 (245 ms) [Lambda: 26583923, Random: 77886515]
067 Res: 200 (219 ms) [Lambda: 26583923, Random: 37808567]
068 Res: 200 (198 ms) [Lambda: 26583923, Random: 93237951]
069 Res: 200 (207 ms) [Lambda: 26583923, Random: 46377288]
070 Res: 200 (197 ms) [Lambda: 26583923, Random: 49759899]
071 Res: 200 (208 ms) [Lambda: 26583923, Random: 49836736]
072 Res: 200 (197 ms) [Lambda: 26583923, Random: 15809919]
073 Res: 200 (197 ms) [Lambda: 26583923, Random: 35581637]
074 Res: 200 (206 ms) [Lambda: 26583923, Random: 09443121]
075 Res: 200 (201 ms) [Lambda: 26583923, Random: 11021392]
076 Res: 200 (205 ms) [Lambda: 26583923, Random: 63926370]
077 Res: 200 (196 ms) [Lambda: 26583923, Random: 46689722]
078 Res: 200 (196 ms) [Lambda: 26583923, Random: 53120402]
079 Res: 200 (208 ms) [Lambda: 26583923, Random: 22624502]
080 Res: 200 (202 ms) [Lambda: 26583923, Random: 98478045]
081 Res: 200 (197 ms) [Lambda: 26583923, Random: 09629832]
082 Res: 200 (207 ms) [Lambda: 26583923, Random: 93113470]
083 Res: 200 (196 ms) [Lambda: 26583923, Random: 54286163]
084 Res: 200 (197 ms) [Lambda: 26583923, Random: 72867642]
085 Res: 200 (213 ms) [Lambda: 26583923, Random: 88968942]
086 Res: 200 (198 ms) [Lambda: 26583923, Random: 94997616]
087 Res: 200 (201 ms) [Lambda: 26583923, Random: 21299650]
088 Res: 200 (207 ms) [Lambda: 26583923, Random: 46413811]
089 Res: 200 (224 ms) [Lambda: 26583923, Random: 44540276]
090 Res: 200 (255 ms) [Lambda: 26583923, Random: 43536012]
091 Res: 200 (215 ms) [Lambda: 26583923, Random: 19014802]
092 Res: 200 (214 ms) [Lambda: 26583923, Random: 50250239]
093 Res: 200 (194 ms) [Lambda: 26583923, Random: 20586177]
094 Res: 200 (205 ms) [Lambda: 26583923, Random: 92389885]
095 Res: 200 (194 ms) [Lambda: 26583923, Random: 23032628]
096 Res: 200 (203 ms) [Lambda: 26583923, Random: 40064271]
097 Res: 200 (215 ms) [Lambda: 26583923, Random: 08350996]
098 Res: 200 (224 ms) [Lambda: 26583923, Random: 71019014]
099 Res: 200 (204 ms) [Lambda: 26583923, Random: 12039563]
100 Res: 200 (202 ms) [Lambda: 26583923, Random: 11602625]

URL[https://d3kxy2u36xjgwi.cloudfront.net/example]
001 Res: 200 (183 ms) [Lambda: 26583923, Random: 67227017]
002 Res: 200 (183 ms) [Lambda: 26583923, Random: 31497260]
003 Res: 200 (189 ms) [Lambda: 26583923, Random: 13870738]
004 Res: 200 (472 ms) [Lambda: 26583923, Random: 71465501]
005 Res: 200 (174 ms) [Lambda: 26583923, Random: 07752079]
006 Res: 200 (175 ms) [Lambda: 26583923, Random: 62467208]
007 Res: 200 (179 ms) [Lambda: 26583923, Random: 12822600]
008 Res: 200 (186 ms) [Lambda: 26583923, Random: 49140045]
009 Res: 200 (611 ms) [Lambda: 26583923, Random: 79631263]
010 Res: 200 (195 ms) [Lambda: 26583923, Random: 13166828]
011 Res: 200 (204 ms) [Lambda: 26583923, Random: 09688007]
012 Res: 200 (610 ms) [Lambda: 26583923, Random: 16270269]
013 Res: 200 (175 ms) [Lambda: 26583923, Random: 52164026]
014 Res: 200 (186 ms) [Lambda: 26583923, Random: 68413793]
015 Res: 200 (196 ms) [Lambda: 26583923, Random: 17752433]
016 Res: 200 (182 ms) [Lambda: 26583923, Random: 15409894]
017 Res: 200 (474 ms) [Lambda: 26583923, Random: 94248830]
018 Res: 200 (196 ms) [Lambda: 26583923, Random: 13446771]
019 Res: 200 (178 ms) [Lambda: 26583923, Random: 07554993]
020 Res: 200 (611 ms) [Lambda: 26583923, Random: 55933758]
021 Res: 200 (183 ms) [Lambda: 26583923, Random: 25789307]
022 Res: 200 (190 ms) [Lambda: 26583923, Random: 68238143]
023 Res: 200 (175 ms) [Lambda: 26583923, Random: 11284970]
024 Res: 200 (199 ms) [Lambda: 26583923, Random: 87095348]
025 Res: 200 (186 ms) [Lambda: 26583923, Random: 66430513]
026 Res: 200 (176 ms) [Lambda: 26583923, Random: 85372801]
027 Res: 200 (187 ms) [Lambda: 26583923, Random: 74975881]
028 Res: 200 (190 ms) [Lambda: 26583923, Random: 52594803]
029 Res: 200 (174 ms) [Lambda: 26583923, Random: 50662836]
030 Res: 200 (189 ms) [Lambda: 26583923, Random: 41103046]
031 Res: 200 (190 ms) [Lambda: 26583923, Random: 76354851]
032 Res: 200 (175 ms) [Lambda: 26583923, Random: 45037780]
033 Res: 200 (182 ms) [Lambda: 26583923, Random: 23855502]
034 Res: 200 (473 ms) [Lambda: 26583923, Random: 70236646]
035 Res: 200 (174 ms) [Lambda: 26583923, Random: 78746429]
036 Res: 200 (173 ms) [Lambda: 26583923, Random: 62932704]
037 Res: 200 (611 ms) [Lambda: 26583923, Random: 26728978]
038 Res: 200 (193 ms) [Lambda: 26583923, Random: 18505976]
039 Res: 200 (180 ms) [Lambda: 26583923, Random: 53292428]
040 Res: 200 (179 ms) [Lambda: 26583923, Random: 66699016]
041 Res: 200 (192 ms) [Lambda: 26583923, Random: 49902777]
042 Res: 200 (176 ms) [Lambda: 26583923, Random: 57427862]
043 Res: 200 (173 ms) [Lambda: 26583923, Random: 21711145]
044 Res: 200 (174 ms) [Lambda: 26583923, Random: 88230422]
045 Res: 200 (182 ms) [Lambda: 26583923, Random: 97855021]
046 Res: 200 (172 ms) [Lambda: 26583923, Random: 26532272]
047 Res: 200 (174 ms) [Lambda: 26583923, Random: 69926774]
048 Res: 200 (178 ms) [Lambda: 26583923, Random: 88669491]
049 Res: 200 (179 ms) [Lambda: 26583923, Random: 71213613]
050 Res: 200 (175 ms) [Lambda: 26583923, Random: 37924268]
051 Res: 200 (612 ms) [Lambda: 26583923, Random: 48653551]
052 Res: 200 (189 ms) [Lambda: 26583923, Random: 02779735]
053 Res: 200 (174 ms) [Lambda: 26583923, Random: 68015477]
054 Res: 200 (170 ms) [Lambda: 26583923, Random: 13209623]
055 Res: 200 (186 ms) [Lambda: 26583923, Random: 75982721]
056 Res: 200 (193 ms) [Lambda: 26583923, Random: 72523785]
057 Res: 200 (181 ms) [Lambda: 26583923, Random: 97673111]
058 Res: 200 (612 ms) [Lambda: 26583923, Random: 39504768]
059 Res: 200 (513 ms) [Lambda: 26583923, Random: 69109513]
060 Res: 200 (174 ms) [Lambda: 26583923, Random: 00536595]
061 Res: 200 (183 ms) [Lambda: 26583923, Random: 82584874]
062 Res: 200 (177 ms) [Lambda: 26583923, Random: 79021645]
063 Res: 200 (185 ms) [Lambda: 26583923, Random: 06844437]
064 Res: 200 (462 ms) [Lambda: 26583923, Random: 37082690]
065 Res: 200 (182 ms) [Lambda: 26583923, Random: 25401640]
066 Res: 200 (174 ms) [Lambda: 26583923, Random: 56938154]
067 Res: 200 (170 ms) [Lambda: 26583923, Random: 76106095]
068 Res: 200 (611 ms) [Lambda: 26583923, Random: 42860105]
069 Res: 200 (178 ms) [Lambda: 26583923, Random: 84860127]
070 Res: 200 (169 ms) [Lambda: 26583923, Random: 47838316]
071 Res: 200 (179 ms) [Lambda: 26583923, Random: 72766579]
072 Res: 200 (172 ms) [Lambda: 26583923, Random: 95996238]
073 Res: 200 (185 ms) [Lambda: 26583923, Random: 53821358]
074 Res: 200 (176 ms) [Lambda: 26583923, Random: 55841516]
075 Res: 200 (174 ms) [Lambda: 26583923, Random: 80666288]
076 Res: 200 (188 ms) [Lambda: 26583923, Random: 88504405]
077 Res: 200 (611 ms) [Lambda: 26583923, Random: 88556120]
078 Res: 200 (176 ms) [Lambda: 26583923, Random: 01689494]
079 Res: 200 (182 ms) [Lambda: 26583923, Random: 08529937]
080 Res: 200 (187 ms) [Lambda: 26583923, Random: 53257663]
081 Res: 200 (171 ms) [Lambda: 26583923, Random: 92019515]
082 Res: 200 (176 ms) [Lambda: 26583923, Random: 31400301]
083 Res: 200 (165 ms) [Lambda: 26583923, Random: 55673494]
084 Res: 200 (168 ms) [Lambda: 26583923, Random: 67452817]
085 Res: 200 (174 ms) [Lambda: 26583923, Random: 72607357]
086 Res: 200 (171 ms) [Lambda: 26583923, Random: 98278783]
087 Res: 200 (177 ms) [Lambda: 26583923, Random: 07229058]
088 Res: 200 (603 ms) [Lambda: 26583923, Random: 63851622]
089 Res: 200 (174 ms) [Lambda: 26583923, Random: 88329473]
090 Res: 200 (610 ms) [Lambda: 26583923, Random: 94707341]
091 Res: 200 (462 ms) [Lambda: 26583923, Random: 18571988]
092 Res: 200 (462 ms) [Lambda: 26583923, Random: 73921946]
093 Res: 200 (679 ms) [Lambda: 26583923, Random: 69335164]
094 Res: 200 (273 ms) [Lambda: 26583923, Random: 57881111]
095 Res: 200 (179 ms) [Lambda: 26583923, Random: 75637184]
096 Res: 200 (177 ms) [Lambda: 26583923, Random: 20557050]
097 Res: 200 (165 ms) [Lambda: 26583923, Random: 80319597]
098 Res: 200 (618 ms) [Lambda: 26583923, Random: 54323297]
099 Res: 200 (176 ms) [Lambda: 26583923, Random: 19286578]
100 Res: 200 (180 ms) [Lambda: 26583923, Random: 66047538]

API Gateway average response time: 208.8 ms
CloudFront average response time: 253.98 ms
```

:::

直接 API Gateway にアクセスした場合は、最大で 280ms、約9割が 194ms〜223ms の範囲に収まる安定した結果となっています。

対して CloudFront 経由でアクセスした場合は、約8割は 165ms〜204ms の範囲で API Gateway を直接叩いた場合より早くなっています。
おそらく CloudFront と API Gateway の通信品質が良い事による影響なのかな、と推測しています。

しかし残り約2割は 462ms〜679ms になっており、約2〜3倍程度遅くなってしまうようです。
Lambda のコールドスタートとかかな、と一瞬思いましたが、レスポンスの `lambda` は同じ値を返しているので、同じ関数インスタンスから返却されているようです。
設定なのか、AWSの何らかの仕様なのかは分かりませんが、こういうケースがあるということは1つの発見でした。
（もしこの原因をご存じの方おられましたら教えていただけるとありがたいです🙏）



## ap-northeast-1 (東京) の結果

us-east-1 (バージニア) の場合 CloudFront を挟むとレスポンスが安定しないので、ap-northeast-1 (東京) リージョンの場合はどうなるかを試してみました。
(IaC 化しているので、リージョン名だけ変えれば簡単に再現できるのはメリットです)

結果はこんな感じでした。

```
API Gateway average response time: 40.29 ms
CloudFront average response time: 40.45 ms
```

ほとんど差がありませんでした。
1つ一つの結果を見てみても大きな差はありませんでした。

:::details 詳細な結果

※フォーマットは `[実行回数] Res: [レスポンスコード] ([レスポンス時間] ms) [Lambda: [関数インスタンスを表す乱数], Random: [リクエストごとに変わる乱数]]` になっています。

```
$  deno run --allow-net --allow-read ./measure/datetime.ts

URL[https://qrv2oo3r2f.execute-api.ap-northeast-1.amazonaws.com/dev/example]
001 Res: 200 (35 ms) [Lambda: 49586345, Random: 46328809]
002 Res: 200 (58 ms) [Lambda: 49586345, Random: 04381055]
003 Res: 200 (56 ms) [Lambda: 49586345, Random: 76025971]
004 Res: 200 (39 ms) [Lambda: 49586345, Random: 57208244]
005 Res: 200 (56 ms) [Lambda: 49586345, Random: 90316780]
006 Res: 200 (64 ms) [Lambda: 49586345, Random: 78508683]
007 Res: 200 (44 ms) [Lambda: 49586345, Random: 58850070]
008 Res: 200 (49 ms) [Lambda: 49586345, Random: 40336516]
009 Res: 200 (39 ms) [Lambda: 49586345, Random: 57173721]
010 Res: 200 (43 ms) [Lambda: 49586345, Random: 99234783]
011 Res: 200 (64 ms) [Lambda: 49586345, Random: 09546953]
012 Res: 200 (37 ms) [Lambda: 49586345, Random: 70294825]
013 Res: 200 (62 ms) [Lambda: 49586345, Random: 79429773]
014 Res: 200 (59 ms) [Lambda: 49586345, Random: 78294869]
015 Res: 200 (31 ms) [Lambda: 49586345, Random: 93784581]
016 Res: 200 (66 ms) [Lambda: 49586345, Random: 26516610]
017 Res: 200 (69 ms) [Lambda: 49586345, Random: 55805912]
018 Res: 200 (58 ms) [Lambda: 49586345, Random: 77863013]
019 Res: 200 (36 ms) [Lambda: 49586345, Random: 83177823]
020 Res: 200 (62 ms) [Lambda: 49586345, Random: 84374174]
021 Res: 200 (27 ms) [Lambda: 49586345, Random: 36461047]
022 Res: 200 (41 ms) [Lambda: 49586345, Random: 92546896]
023 Res: 200 (44 ms) [Lambda: 49586345, Random: 34813307]
024 Res: 200 (67 ms) [Lambda: 49586345, Random: 44438752]
025 Res: 200 (34 ms) [Lambda: 49586345, Random: 83014034]
026 Res: 200 (35 ms) [Lambda: 49586345, Random: 94154826]
027 Res: 200 (35 ms) [Lambda: 49586345, Random: 55375261]
028 Res: 200 (40 ms) [Lambda: 49586345, Random: 61748753]
029 Res: 200 (29 ms) [Lambda: 49586345, Random: 15204134]
030 Res: 200 (47 ms) [Lambda: 49586345, Random: 14310069]
031 Res: 200 (43 ms) [Lambda: 49586345, Random: 73111876]
032 Res: 200 (30 ms) [Lambda: 49586345, Random: 21411892]
033 Res: 200 (37 ms) [Lambda: 49586345, Random: 98920087]
034 Res: 200 (58 ms) [Lambda: 49586345, Random: 57406584]
035 Res: 200 (39 ms) [Lambda: 49586345, Random: 03638952]
036 Res: 200 (37 ms) [Lambda: 49586345, Random: 34050629]
037 Res: 200 (36 ms) [Lambda: 49586345, Random: 90654667]
038 Res: 200 (41 ms) [Lambda: 49586345, Random: 93149701]
039 Res: 200 (26 ms) [Lambda: 49586345, Random: 60712356]
040 Res: 200 (43 ms) [Lambda: 49586345, Random: 74322662]
041 Res: 200 (50 ms) [Lambda: 49586345, Random: 98407266]
042 Res: 200 (38 ms) [Lambda: 49586345, Random: 38131620]
043 Res: 200 (49 ms) [Lambda: 49586345, Random: 79855219]
044 Res: 200 (53 ms) [Lambda: 49586345, Random: 52007140]
045 Res: 200 (41 ms) [Lambda: 49586345, Random: 38285877]
046 Res: 200 (37 ms) [Lambda: 49586345, Random: 47696812]
047 Res: 200 (43 ms) [Lambda: 49586345, Random: 42395334]
048 Res: 200 (42 ms) [Lambda: 49586345, Random: 67798432]
049 Res: 200 (40 ms) [Lambda: 49586345, Random: 44159849]
050 Res: 200 (37 ms) [Lambda: 49586345, Random: 23339771]
051 Res: 200 (23 ms) [Lambda: 49586345, Random: 27830541]
052 Res: 200 (37 ms) [Lambda: 49586345, Random: 46067274]
053 Res: 200 (34 ms) [Lambda: 49586345, Random: 35812132]
054 Res: 200 (37 ms) [Lambda: 49586345, Random: 95167018]
055 Res: 200 (35 ms) [Lambda: 49586345, Random: 24764715]
056 Res: 200 (24 ms) [Lambda: 49586345, Random: 37939902]
057 Res: 200 (39 ms) [Lambda: 49586345, Random: 22031109]
058 Res: 200 (37 ms) [Lambda: 49586345, Random: 60213860]
059 Res: 200 (30 ms) [Lambda: 49586345, Random: 75259749]
060 Res: 200 (35 ms) [Lambda: 49586345, Random: 42261603]
061 Res: 200 (32 ms) [Lambda: 49586345, Random: 39865419]
062 Res: 200 (24 ms) [Lambda: 49586345, Random: 02339304]
063 Res: 200 (36 ms) [Lambda: 49586345, Random: 70773062]
064 Res: 200 (38 ms) [Lambda: 49586345, Random: 41179929]
065 Res: 200 (40 ms) [Lambda: 49586345, Random: 16468226]
066 Res: 200 (44 ms) [Lambda: 49586345, Random: 20862215]
067 Res: 200 (36 ms) [Lambda: 49586345, Random: 72551985]
068 Res: 200 (36 ms) [Lambda: 49586345, Random: 45485377]
069 Res: 200 (53 ms) [Lambda: 49586345, Random: 21351444]
070 Res: 200 (31 ms) [Lambda: 49586345, Random: 88148577]
071 Res: 200 (34 ms) [Lambda: 49586345, Random: 37393981]
072 Res: 200 (25 ms) [Lambda: 49586345, Random: 39634428]
073 Res: 200 (44 ms) [Lambda: 49586345, Random: 64931304]
074 Res: 200 (35 ms) [Lambda: 49586345, Random: 46717950]
075 Res: 200 (27 ms) [Lambda: 49586345, Random: 34603053]
076 Res: 200 (33 ms) [Lambda: 49586345, Random: 01195194]
077 Res: 200 (41 ms) [Lambda: 49586345, Random: 46537866]
078 Res: 200 (38 ms) [Lambda: 49586345, Random: 44604444]
079 Res: 200 (50 ms) [Lambda: 49586345, Random: 49492090]
080 Res: 200 (39 ms) [Lambda: 49586345, Random: 24533465]
081 Res: 200 (34 ms) [Lambda: 49586345, Random: 20769744]
082 Res: 200 (37 ms) [Lambda: 49586345, Random: 28222576]
083 Res: 200 (37 ms) [Lambda: 49586345, Random: 32913317]
084 Res: 200 (32 ms) [Lambda: 49586345, Random: 19155468]
085 Res: 200 (36 ms) [Lambda: 49586345, Random: 65869758]
086 Res: 200 (41 ms) [Lambda: 49586345, Random: 29303334]
087 Res: 200 (51 ms) [Lambda: 49586345, Random: 74212281]
088 Res: 200 (52 ms) [Lambda: 49586345, Random: 24515042]
089 Res: 200 (35 ms) [Lambda: 49586345, Random: 73595073]
090 Res: 200 (44 ms) [Lambda: 49586345, Random: 41245090]
091 Res: 200 (22 ms) [Lambda: 49586345, Random: 92452158]
092 Res: 200 (39 ms) [Lambda: 49586345, Random: 33738015]
093 Res: 200 (27 ms) [Lambda: 49586345, Random: 57949807]
094 Res: 200 (34 ms) [Lambda: 49586345, Random: 91375519]
095 Res: 200 (36 ms) [Lambda: 49586345, Random: 76946338]
096 Res: 200 (39 ms) [Lambda: 49586345, Random: 21181155]
097 Res: 200 (37 ms) [Lambda: 49586345, Random: 49694461]
098 Res: 200 (34 ms) [Lambda: 49586345, Random: 29112303]
099 Res: 200 (23 ms) [Lambda: 49586345, Random: 96898827]
100 Res: 200 (26 ms) [Lambda: 49586345, Random: 15107245]

URL[https://d220tbp9jozg9d.cloudfront.net/example]
001 Res: 200 (49 ms) [Lambda: 49586345, Random: 62856423]
002 Res: 200 (62 ms) [Lambda: 49586345, Random: 99557758]
003 Res: 200 (44 ms) [Lambda: 49586345, Random: 49042453]
004 Res: 200 (53 ms) [Lambda: 49586345, Random: 67990602]
005 Res: 200 (53 ms) [Lambda: 49586345, Random: 48636361]
006 Res: 200 (61 ms) [Lambda: 49586345, Random: 86382496]
007 Res: 200 (60 ms) [Lambda: 49586345, Random: 99232725]
008 Res: 200 (72 ms) [Lambda: 49586345, Random: 84431075]
009 Res: 200 (48 ms) [Lambda: 49586345, Random: 18705201]
010 Res: 200 (47 ms) [Lambda: 49586345, Random: 35322114]
011 Res: 200 (41 ms) [Lambda: 49586345, Random: 19670382]
012 Res: 200 (33 ms) [Lambda: 49586345, Random: 21428184]
013 Res: 200 (46 ms) [Lambda: 49586345, Random: 23541620]
014 Res: 200 (35 ms) [Lambda: 49586345, Random: 16651966]
015 Res: 200 (64 ms) [Lambda: 49586345, Random: 93374907]
016 Res: 200 (40 ms) [Lambda: 49586345, Random: 71590965]
017 Res: 200 (36 ms) [Lambda: 49586345, Random: 93056517]
018 Res: 200 (37 ms) [Lambda: 49586345, Random: 71151323]
019 Res: 200 (48 ms) [Lambda: 49586345, Random: 32418311]
020 Res: 200 (40 ms) [Lambda: 49586345, Random: 26137193]
021 Res: 200 (48 ms) [Lambda: 49586345, Random: 53662879]
022 Res: 200 (42 ms) [Lambda: 49586345, Random: 07822178]
023 Res: 200 (40 ms) [Lambda: 49586345, Random: 65359189]
024 Res: 200 (45 ms) [Lambda: 49586345, Random: 29818034]
025 Res: 200 (50 ms) [Lambda: 49586345, Random: 78844596]
026 Res: 200 (59 ms) [Lambda: 49586345, Random: 30748102]
027 Res: 200 (40 ms) [Lambda: 49586345, Random: 77605238]
028 Res: 200 (47 ms) [Lambda: 49586345, Random: 66385628]
029 Res: 200 (29 ms) [Lambda: 49586345, Random: 07243973]
030 Res: 200 (45 ms) [Lambda: 49586345, Random: 81833534]
031 Res: 200 (28 ms) [Lambda: 49586345, Random: 88417865]
032 Res: 200 (35 ms) [Lambda: 49586345, Random: 58531637]
033 Res: 200 (37 ms) [Lambda: 49586345, Random: 79214772]
034 Res: 200 (28 ms) [Lambda: 49586345, Random: 06604091]
035 Res: 200 (37 ms) [Lambda: 49586345, Random: 01853166]
036 Res: 200 (28 ms) [Lambda: 49586345, Random: 49686055]
037 Res: 200 (65 ms) [Lambda: 49586345, Random: 13187711]
038 Res: 200 (50 ms) [Lambda: 49586345, Random: 35032296]
039 Res: 200 (50 ms) [Lambda: 49586345, Random: 70871541]
040 Res: 200 (28 ms) [Lambda: 49586345, Random: 77063156]
041 Res: 200 (58 ms) [Lambda: 49586345, Random: 41642226]
042 Res: 200 (25 ms) [Lambda: 49586345, Random: 60592176]
043 Res: 200 (42 ms) [Lambda: 49586345, Random: 53176444]
044 Res: 200 (33 ms) [Lambda: 49586345, Random: 93564164]
045 Res: 200 (61 ms) [Lambda: 49586345, Random: 26389958]
046 Res: 200 (36 ms) [Lambda: 49586345, Random: 19099982]
047 Res: 200 (27 ms) [Lambda: 49586345, Random: 81756777]
048 Res: 200 (28 ms) [Lambda: 49586345, Random: 47137184]
049 Res: 200 (30 ms) [Lambda: 49586345, Random: 69988168]
050 Res: 200 (39 ms) [Lambda: 49586345, Random: 48198863]
051 Res: 200 (37 ms) [Lambda: 49586345, Random: 51344016]
052 Res: 200 (44 ms) [Lambda: 49586345, Random: 97300481]
053 Res: 200 (28 ms) [Lambda: 49586345, Random: 00175065]
054 Res: 200 (40 ms) [Lambda: 49586345, Random: 66766694]
055 Res: 200 (34 ms) [Lambda: 49586345, Random: 63168263]
056 Res: 200 (27 ms) [Lambda: 49586345, Random: 53481668]
057 Res: 200 (35 ms) [Lambda: 49586345, Random: 22977985]
058 Res: 200 (48 ms) [Lambda: 49586345, Random: 65333319]
059 Res: 200 (51 ms) [Lambda: 49586345, Random: 10907442]
060 Res: 200 (33 ms) [Lambda: 49586345, Random: 97518887]
061 Res: 200 (32 ms) [Lambda: 49586345, Random: 52690403]
062 Res: 200 (31 ms) [Lambda: 49586345, Random: 58835839]
063 Res: 200 (41 ms) [Lambda: 49586345, Random: 99338446]
064 Res: 200 (37 ms) [Lambda: 49586345, Random: 22013131]
065 Res: 200 (33 ms) [Lambda: 49586345, Random: 65244762]
066 Res: 200 (38 ms) [Lambda: 49586345, Random: 24349744]
067 Res: 200 (34 ms) [Lambda: 49586345, Random: 31832013]
068 Res: 200 (36 ms) [Lambda: 49586345, Random: 36512103]
069 Res: 200 (53 ms) [Lambda: 49586345, Random: 19291237]
070 Res: 200 (27 ms) [Lambda: 49586345, Random: 58340632]
071 Res: 200 (29 ms) [Lambda: 49586345, Random: 70335126]
072 Res: 200 (26 ms) [Lambda: 49586345, Random: 27983408]
073 Res: 200 (29 ms) [Lambda: 49586345, Random: 47817558]
074 Res: 200 (37 ms) [Lambda: 49586345, Random: 72224622]
075 Res: 200 (41 ms) [Lambda: 49586345, Random: 32508261]
076 Res: 200 (35 ms) [Lambda: 49586345, Random: 55177645]
077 Res: 200 (39 ms) [Lambda: 49586345, Random: 69025485]
078 Res: 200 (34 ms) [Lambda: 49586345, Random: 62953932]
079 Res: 200 (28 ms) [Lambda: 49586345, Random: 97016917]
080 Res: 200 (35 ms) [Lambda: 49586345, Random: 14382201]
081 Res: 200 (28 ms) [Lambda: 49586345, Random: 16747468]
082 Res: 200 (40 ms) [Lambda: 49586345, Random: 32404392]
083 Res: 200 (28 ms) [Lambda: 49586345, Random: 73828896]
084 Res: 200 (40 ms) [Lambda: 49586345, Random: 73463384]
085 Res: 200 (76 ms) [Lambda: 49586345, Random: 19364788]
086 Res: 200 (41 ms) [Lambda: 49586345, Random: 54842484]
087 Res: 200 (28 ms) [Lambda: 49586345, Random: 47336849]
088 Res: 200 (38 ms) [Lambda: 49586345, Random: 10328483]
089 Res: 200 (33 ms) [Lambda: 49586345, Random: 25268866]
090 Res: 200 (62 ms) [Lambda: 49586345, Random: 99207825]
091 Res: 200 (27 ms) [Lambda: 49586345, Random: 36900936]
092 Res: 200 (23 ms) [Lambda: 49586345, Random: 64878177]
093 Res: 200 (35 ms) [Lambda: 49586345, Random: 06455647]
094 Res: 200 (29 ms) [Lambda: 49586345, Random: 81629638]
095 Res: 200 (39 ms) [Lambda: 49586345, Random: 41763277]
096 Res: 200 (34 ms) [Lambda: 49586345, Random: 21900791]
097 Res: 200 (34 ms) [Lambda: 49586345, Random: 13804238]
098 Res: 200 (42 ms) [Lambda: 49586345, Random: 37837737]
099 Res: 200 (71 ms) [Lambda: 49586345, Random: 26094961]
100 Res: 200 (46 ms) [Lambda: 49586345, Random: 25042753]

API Gateway average response time: 40.29 ms
CloudFront average response time: 40.45 ms
```

:::

僅かに CloudFront 経由のほうが遅いですが、1ms 未満なので誤差の範囲と見て良いレベルかと思います。


# まとめ

1. CloudFront を挟んでも ap-northeast-1 (東京) リージョンであれば大差ない
2. us-east-1 (バージニア) リージョンの場合はむしろ早くなる場合が約8割
    - ただし約2割のレスポンス時間が約2〜3倍程度に大きくなる場合がある。
    - 原因は不明（ご存じの方おられましたら、コメントなど頂けると助かります🙇‍♂️）

us-east-1 (バージニア) の場合にレスポンス時間が安定しないのは納得できないところですが、特に ap-northeast-1 (東京) リージョンで使用する分にはほとんど影響ないレベルかな、と思いました。
CloudFront のオリジンに API Gateway を含めるのは、実用的な範囲内であると思います。
