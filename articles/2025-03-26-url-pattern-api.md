---
title: URLPattern API を試す（コード例付き）
emoji: "⚗️"
type: "tech"
topics: ["JavaScript","Node.js", "Web API"]
published: true
canonical: "https://zenn.dev/mryhryki/articles/2025-03-26-url-pattern-api"
---

# はじめに

Node Weekly というメールマガジンで URLPattern という API が Node.js 23.8.0 でリリースされたようです。
この記事は URLPattern API を試したメモです。
API の詳細は以下の参考記事を参照してください。

## 参照記事

- [New URLPattern API brings improved pattern matching to Node.js and Cloudflare Workers](https://blog.cloudflare.com/improving-web-standards-urlpattern/)
- [Node.js — Node v23.8.0 (Current)](https://nodejs.org/en/blog/release/v23.8.0)
  - [Release 2025-02-13, Version 23.8.0 (Current), @targos · nodejs/node](https://github.com/nodejs/node/releases/tag/v23.8.0)
  - `v23.8.0` 時点では `node:url` からインポートできますが、`v24` では [Global object](https://developer.mozilla.org/ja/docs/Glossary/Global_object) から参照できるようになりそうです。
- [URLPattern - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)
  - [Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern#browser_compatibility) を見ると、2025-03-26 時点で以下の環境で使えるようです。
    - Chrome: `v95` 以降
    - Edge: `v95` 以降
    - Deno: `v1.15` 以降
- [Node Weekly Issue 571: March 25, 2025](https://nodeweekly.com/issues/571)

# URLPattern API とは

名前の指す通り、URL のパターンを扱う API です。
以下のサンプルコードが分かりやすかったので引用します。

```javascript
// https://blog.cloudflare.com/improving-web-standards-urlpattern/

const pattern = new URLPattern({
  pathname: '/blog/:year/:month/:slug'
});

if (pattern.test('https://example.com/blog/2025/03/urlpattern-launch')) {
  console.log('Match found!');
}

const result = pattern.exec('https://example.com/blog/2025/03/urlpattern-launch');
console.log(result.pathname.groups.year); // "2025"
console.log(result.pathname.groups.month); // "03"
console.log(result.pathname.groups.slug); // "urlpattern-launch"
```

# API

## Constructor

以下３つの引数を取ります。

- `input`
- `baseURL`
- `options`

詳細は [URLPattern: URLPattern() constructor - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/URLPattern) を見るのが正確そうです。
以下、軽いメモと実験した結果を書きます。

### input

`string` または、オブジェクトを指定するようです。

`string` の場合、URL形式で指定する必要がありそうです。
`baseUrl` 無しでパスのみの指定だと、エラーになりました。

```javascript
new URLPattern("/dir/:var", "https://example.com"); // => OK
new URLPattern("/dir/:var"); // => Error
```

オブジェクトは、以下のものが指定できるようです。

- `protocol`
- `username`
- `password`
- `hostname`
- `port`
- `pathname`
- `search`
- `hash`
- `baseURL`

`baseURL` 以外は [URL のプロパティ](https://developer.mozilla.org/en-US/docs/Web/API/URL#instance_properties) に含まれているので、URL のインスタンスを指定することもできました。

```javascript
const protocol = "https:";
const hostname = "example.com";
const pathname = "/dir/:var";
const fullUrl = `${protocol}//${hostname}${pathname}`;

const sample = `${protocol}//${hostname}/dir/1234`;

console.log(new URLPattern(fullUrl).test(sample)); // => true
console.log(new URLPattern(new URL(fullUrl)).test(sample)); // => true
console.log(new URLPattern({ protocol, hostname, pathname }).test(sample)); // => true
```

オブジェクト形式で指定する場合、指定のないものはワイルドカードとして扱われるようです。
実際にコードに書く時は、`new URLPattern({ pathname })` のように指定することが多くなりそうな気がしました。

```javascript
const pathname = "/dir/:var";
const pattern = new URLPattern({ pathname });

const samplePathname = `/dir/1234`;
console.log(pattern.test(`https://host1.example${samplePathname}`)); // => true
console.log(pattern.test(`https://host2.example${samplePathname}`)); // => true
console.log(pattern.test(`https://host3.example${samplePathname}`)); // => true
```

`protocol` や `hostname` だけを指定することで、特定のホストにマッチするかどうかを判定する、という使い方もありそうですね。

```javascript
const pattern = new URLPattern({
  protocol: "https:",
  hostname: "host1.example",
});

console.log(pattern.test(`https://host1.example/foo`)); // => true
console.log(pattern.test(`https://host2.example/foo`)); // => false
```

### baseURL

文字列でベースとなるURLを指定できるようです。
指定する場合、`input` には `string` で指定する必要がありそうです。

```javascript
const pathname = "/dir/:var";
new URLPattern(pathname, "https://example.com");
new URLPattern({ pathname }, "https://example.com"); // => Error
```

[URL のコンストラクタの第2引数](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL#base) と似た働きだと思うので、詳細は割愛します。

### options

オブジェクト形式で、2025-03-26 時点では `ignoreCase` のみが指定できるようです。
`{ ignoreCase: true }` を指定した場合は、大文字小文字を区別しないようです。

```javascript
const pathname = "/dir/:var";
const defaultPattern = new URLPattern({ pathname });
const caseSensitivePattern = new URLPattern({ pathname }, { ignoreCase: false });
const ignoreCasePattern = new URLPattern({ pathname }, { ignoreCase: true });

const sample = "https://example.com/DIR/1234";
console.log(defaultPattern.test(sample)); // => false
console.log(caseSensitivePattern.test(sample)); // => false
console.log(ignoreCasePattern.test(sample)); // => true
```

## URLPattern.test

指定されたパスが、パターンと合致するかどうかを返すメソッドです。
引数は、コンストラクタの `input`, `baseURL` と同じものを指定できるようです。

MDN のサンプルが網羅されて分かりやすかったので引用します。

```javascript
// https://developer.mozilla.org/en-US/docs/Web/API/URLPattern/test#examples

const pattern = new URLPattern("http{s}?://*.example.com/books/:id");

// Absolute URL strings
console.log(pattern.test("https://store.example.com/books/123")); // true
console.log(pattern.test("https://example.com/books/123")); // false

// Relative URL strings
console.log(pattern.test("/books/123", "http://store.example.com")); // true
console.log(pattern.test("/books/123", "data:text/plain,hello world!")); // false
console.log(pattern.test("/books/123")); // false

// Structured objects
console.log(
  pattern.test({
    pathname: "/books/123",
    baseURL: "http://store.example.com",
  }),
); // true
console.log(
  pattern.test({
    protocol: "https",
    hostname: "store.example.com",
    pathname: "/books/123",
  }),
); // true
console.log(
  pattern.test({
    protocol: "file",
    hostname: "store.example.com",
    pathname: "/books/123",
  }),
); // false
```

## URLPattern.exec

パターンにマッチさせた結果をオブジェクト形式で返してくれるメソッドです。
パターンがマッチしない場合は `null` を返します。
引数は、コンストラクタの `input`, `baseURL` と同じものを指定できるようです。

以下はサンプルです。
`:var` のようなパターンにマッチしたものは `{key}.groups.var` のように参照することができるようです。

```javascript
const pattern = new URLPattern("https://:third.:second.example/dir/:first/subdir/:second");

console.log(`URLPattern.exec: ${JSON.stringify(pattern.exec("https://unmatch.example"), null, 2)}`);
// => URLPattern.exec: null

console.log(`URLPattern.exec: ${JSON.stringify(pattern.exec("/dir/1ebc4982/subdir/2109cc63", "https://foo.bar.example"), null, 2)}`);
// => URLPattern.exec: {
//   "inputs": [
//     "/dir/1ebc4982/subdir/2109cc63",
//     "https://foo.bar.example"
//   ],
//   "protocol": {
//     "input": "https",
//     "groups": {}
//   },
//   "username": {
//     "input": "",
//     "groups": {
//       "0": ""
//     }
//   },
//   "password": {
//     "input": "",
//     "groups": {
//       "0": ""
//     }
//   },
//   "hostname": {
//     "input": "foo.bar.example",
//     "groups": {
//       "second": "bar",
//       "third": "foo"
//     }
//   },
//   "port": {
//     "input": "",
//     "groups": {}
//   },
//   "pathname": {
//     "input": "/dir/1ebc4982/subdir/2109cc63",
//     "groups": {
//       "second": "2109cc63",
//       "first": "1ebc4982"
//     }
//   },
//   "search": {
//     "input": "",
//     "groups": {
//       "0": ""
//     }
//   },
//   "hash": {
//     "input": "",
//     "groups": {
//       "0": ""
//     }
//   }
// }
```

# 使い所

軽く触ってみて、色々使い所はありそうですが、私は特に以下のようなケースで使えるのではないかと思いました。

- 簡易的なルーティング
- ドメインによる処理分岐
- Service Worker

## 簡易的なルーティング

一番最初に思いついたのはこれでした。
簡易的にHTTPサーバーを作る時に、ライブラリ無しでパスパラメーターをサポートしたルーティングが簡単に作れそうです。

特に Deno であれば既にサポートされていますし、Deno Deploy を使えば簡単に公開できるので便利だな、と思いました。
以下は、Deno の例です。

```typescript
const articlePattern = new URLPattern({ pathname: "/article/:slug" });
const userPattern = new URLPattern({ pathname: "/user/:id" });

Deno.serve(async (req) => {
  const { method, url } = req;
  if (["GET", "POST"].includes(method) && articlePattern.test(url)) {
    const { slug } = articlePattern.exec(url).pathname.groups;
    if (method === "POST") {
      // TODO: Create an article
    }
    // TODO: Get an article content
    return new Response(`[Sample] Article: ${slug}`);
  }

  if (method === "GET" && userPattern.test(url)) {
    const { id } = userPattern.exec(url).pathname.groups;
    // TODO: Get a user data
    return new Response(`[Sample] User: ${id}`);
  }

  return new Response("Not found", { status: 404 });
});
```

以下のような挙動になります。

```shell
$ curl http://localhost:8000/article/1324
[Sample] Article: 1324

$ curl http://localhost:8000/user/5678
[Sample] User: 5678

$ curl http://localhost:8000/not-found
Not found
```

これまでパターンマッチはライブラリなしだと少々面倒な処理でしたが、URLPattern API を使うと簡単に実装できました。

## ドメインによる処理分岐

ドメインに応じて処理を分岐するような処理にも便利そうだな、と思いました。

例えば、ローカルでの開発環境のみなにか実行したい場合は、以下のようにできそうです。

```javascript
const pattern = new URLPattern({ protocol: "http:", hostname: "localhost" });

const isLocal = pattern.test(`http://localhost:8080`);
if (isLocal) {
  console.log("Do something in local environment");
}
```

また、サブドメインに応じて何か処理を分岐したい場合などにも使えると思います。

```javascript
const pattern = new URLPattern({
  protocol: "https:",
  hostname: ":subdomain.example.com",
});

if (!pattern.test(`https://company1.example.com`)) {
  throw new Error("Unexpected URL");
}

const { subdomain } = pattern.exec(`https://company1.example.com`).hostname.groups;
console.log(subdomain); // => company1
// TODO: subdomain に応じた処理
```

## Service Worker

ほぼこの記事を書いた後に見つけた記事で、このような記述がありました。

> URLPattern はもともとは Service Worker での必要性から提案されたようです。そのあたりの詳細は「[Service Worker Scope Pattern Matching Explainer](https://github.com/whatwg/urlpattern/blob/main/explainer.md)」というドキュメントで説明されています。
> [【JavaScript】express ライクな URL ルーティング URLPattern – webfrontend.ninja](https://webfrontend.ninja/js-urlpattern/)

記事中に書かれていますが `scope` の指定が URLPattern でできると柔軟にできそうですね。
また、URLに応じてキャッシュするかなどの判断をすることも多いので、そういった場面でも URLPattern API は便利そうですね。

Service Worker に限らず、ブラウザや Cloudflare Workers などで、キャッシュの判断をする場合などでも便利に使えそうですね。



# Tips

## Node.js での使用方法

Node.js 23.8.0 以降の場合、以下のようにインポートできます。

```javascript
import { URLPattern } from "node:url";
```

Node.js 24 以降は [Global object](https://developer.mozilla.org/ja/docs/Glossary/Global_object) から参照できるようになるようなので、この `import` すら不要になりそうです。

ちなみに Deno も URLPattern はサポートされていますが、`node:url` からのインポートは対応されていないようです。

```shell
$ deno run index.js 
error: Uncaught SyntaxError: The requested module 'node:url' does not provide an export named 'URLPattern'
import { URLPattern } from 'node:url';
         ^
```

以下のように動的にインポートすればできなくはないですが、まぁ Node.js 24 を待ちたいですね。

```javascript
(async () => {
  if (!("URLPattern" in globalThis)) {
    globalThis.URLPattern = (await import("node:url")).URLPattern;
  }
  new URLPattern("https://example.com");
})();
```

## Bun の対応状況

`1.2.5` の時点では、まだサポートされていないようです。

```shell
$ bun run index.js                                    
1 | new URLPattern('https://example.com');
        ^
ReferenceError: Can't find variable: URLPattern
      at /Users/mryhryki/projects/personal/home/temp/URLPattern/index.js:1:5

Bun v1.2.5 (macOS arm64)
```

`node:url` にもまだなさそうでした。

```shell
$ bun run index.js
1 | (function (entry, fetcher)
              ^
SyntaxError: Export named 'URLPattern' not found in module 'url'.

Bun v1.2.5 (macOS arm64)
```

# おわりに

URL の扱いが、ライブラリ無しでもかなり便利に扱えるようになるなー、と私は思いました。
Node.js では `import` が必要だったり、Firefox や Safari ではまだ使えなかったりするので、早くどの環境でも同じように使えるようになって欲しいです。

あと、URLPattern は正規表現ベースらしいのですが、どういう記法が使えるのかまだよく分かっていないので、そこはもうちょっと調べたい。
