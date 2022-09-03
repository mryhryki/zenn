---
title: "共通鍵暗号"
---

共通鍵暗号（または秘密鍵暗号、対象鍵暗号とも）方式とは、通信相手と **事前に共有した** 秘密鍵を用いて暗号化・複合を行う暗号方式。
公開鍵暗号に比べて高速に暗号化・複合が行えるが、秘密鍵の交換を安全に行う方法が課題である。
共通鍵暗号の秘密鍵を公開鍵暗号で交換し、その秘密鍵を使用して共通鍵暗号を使うケースも多い。

暗号化には、ストリーム暗号化方式とブロック暗号化方式の２種類がある。



# ストリーム暗号化方式

> ストリーム暗号（ストリームあんごう、stream cipher）とは、平文をビット単位あるいはバイト単位などで逐次、暗号化する暗号である。
> 
> https://ja.wikipedia.org/wiki/%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%A0%E6%9A%97%E5%8F%B7

> しかし、暗号利用モードのOFB, CFB, CTRなどでブロック暗号を利用するとストリーム暗号が構成できるので、ストリーム暗号専用アルゴリズムは、ブロック暗号と比べて何かしらの点で特長（メリット）がなければ存在する意味がない。たとえば、近年（AESの採択以降）はAESを利用するより高速であることをアピールすることが多い。
>
> https://ja.wikipedia.org/wiki/%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%A0%E6%9A%97%E5%8F%B7

こういった事実から、あまり使われている印象のない暗号方式。

## RC4

高速で仕組みがシンプルなストリーム暗号化方式。
しかし、現在では既に安全ではないとされ、[RFC7465](https://datatracker.ietf.org/doc/html/rfc7465) により禁止された。

## TLS_CHACHA20_POLY1305_SHA256 (TODO)

TODO



# ブロック暗号化方式

ブロック暗号化方式は、データを一定の長さ（ブロック）ごとに暗号化処理する方式。
ブロックの大きさは、128bit (16bytes) が多く使われている。

## DES

> DESとは、1977年にアメリカ連邦政府標準の暗号方式として採用された、共通鍵（秘密鍵）暗号方式の一つ。
> https://e-words.jp/w/DES.html

> 1990年代になりコンピュータの処理性能が向上すると56ビットという鍵長では解読が容易になってしまい、また、暗号研究の進展により差分解読法や線形解読法などの効率的な攻撃法が見出されたため、現代では安全な暗号方式ではないとされている。
> https://e-words.jp/w/DES.html

現在ではあまり使われることのないブロック暗号。

## AES

> AESとは、2000年にアメリカ連邦政府標準の暗号方式として採用された、共通鍵（秘密鍵）暗号方式の一つ。
> https://e-words.jp/w/AES.html

現在、世界で最も広く利用されているブロック暗号。

## 暗号利用モード

> 暗号利用モード（あんごうりようモード、Block cipher modes of operation）とは、ブロック暗号を利用して、ブロック長よりも長いメッセージを暗号化するメカニズムのことである。
> 
> https://ja.wikipedia.org/wiki/%E6%9A%97%E5%8F%B7%E5%88%A9%E7%94%A8%E3%83%A2%E3%83%BC%E3%83%89

暗号化したいデータが鍵長よりも長い場合、繰り返し暗号を適用する必要がある。
最初に紹介する ECB モードのように単純な繰り返しだと問題が生じる場合があるため、他のモードが作られた。

- [暗号利用モードについてまとめる](https://mryhryki.com/view/?type=memo&id=2022-08-17_d262)

### ECB (Electronic Codebook Mode)

単純にブロックごとに同じ秘密鍵で暗号化する方式。
同じ内容のブロックを暗号した場合、同じ暗号データが出力されるためパターンを隠すことができず推奨されない。

以下の Wikipedia で紹介されていた図が分かりやすい。
（注釈も書かれているが、画像がランダムなノイズのように変換されたことが安全であることを示すわけではないことに注意）

![ECBモードで画像を暗号化した場合の例 (Wikipedia より)](https://mryhryki.com/file/UhMCISC8X5rtuQtZ4uNY3FjCTHN0lVASg2pZy1Hq7470dUxw.png)

https://ja.wikipedia.org/wiki/%E6%9A%97%E5%8F%B7%E5%88%A9%E7%94%A8%E3%83%A2%E3%83%BC%E3%83%89

### CBC (Cipher Block Chaining)

CBC は IV (Initial Vector) と前のブロックの暗号化の結果を使用して、同じ内容のブロックを暗号した場合でも別の暗号データを出力できるようにしたモードである。

![CBCモードでの暗号化 (Wikipedia より)](https://mryhryki.com/file/UhM4Wpm049YoDZkybeE-ZVhvxqHO9Dh18OIdztNur2vkrpic.png)  

https://ja.wikipedia.org/wiki/%E6%9A%97%E5%8F%B7%E5%88%A9%E7%94%A8%E3%83%A2%E3%83%BC%E3%83%89

欠点としては、前のブロックの暗号化の結果がないと次のブロックが暗号化できないので、暗号化処理を並列化することができない。

### CTR (Counter)

> CTRモード (Counter Mode) は、ブロック暗号を同期型のストリーム暗号として扱うものである。integer counter mode (ICM) あるいは segmented integer counter mode (SIC) とも呼ばれる。
> 
> https://ja.wikipedia.org/wiki/%E6%9A%97%E5%8F%B7%E5%88%A9%E7%94%A8%E3%83%A2%E3%83%BC%E3%83%89

各ブロックと単調増加するカウンターを組み合わせて暗号化する方式。
前後に関連がないため、暗号化・復号ともに並列化することが可能。

![CTRモードでの暗号化 (Wikipedia より)](https://mryhryki.com/file/UhKaAFLqm4TXsbWTbZfClyLGPWMSV8XYG_C_TpHp9p7aVSoI.png)

https://ja.wikipedia.org/wiki/%E6%9A%97%E5%8F%B7%E5%88%A9%E7%94%A8%E3%83%A2%E3%83%BC%E3%83%89

### CBC-MAC (Cipher Block Chaining Message Authentication Code)

CBCモードを使い、MACを生成する方式。
(MAC については「ハッシュ関数」の章を参照)

暗号化を行うものではないので注意。
また CBC を使うため、並列計算はできない。

![CBC-MACモードでの暗号化 (Wikipedia より)](https://mryhryki.com/file/UhKJRbIgDG33k4CzQxe4XDUi3YERxZGpf_etq8YY4lJh9Byg.png)

https://ja.wikipedia.org/wiki/CBC-MAC

### CCM (Counter with CBC-MAC)

CTR (Counter) と CBC-MAC を組み合わせた方式。
CTR を使い暗号化を行いつつ、CBC-MAC を使い認証を行う。

### GCM (Galois/Counter Mode)

> 名称が示すように、GCMは暗号化としてCTRモードを、認証として新しいGalois modeを組み合わせたものである。
> https://ja.wikipedia.org/wiki/Galois/Counter_Mode

CCM に似て CTR (Counter) モードを利用した暗号化と、と認証 (Galois) を組み合わせた方式。
認証タグと呼ばれるハッシュ値のような値により、暗号化された内容を検証することが可能になる。
CTR (Counter) モードを使用するため、並列計算が可能。

![GCMモードでの暗号化 (Wikipedia より)](https://mryhryki.com/file/Uf1wREF4qqirjdHHDpD_x3E3FWOoELT0p73PciFztE_pE_ig.jpeg)

https://ja.wikipedia.org/wiki/Galois/Counter_Mode

(筆者感想)
並列計算が可能でパフォーマンスが良く、[特許による妨げもない](https://ja.wikipedia.org/wiki/Galois/Counter_Mode#%E7%89%B9%E8%A8%B1) ため、現状では GCM が最も使うべき暗号モードのように思えた。

## 参考リンク

- [共通鍵暗号 - Wikipedia](https://ja.wikipedia.org/wiki/%E5%85%B1%E9%80%9A%E9%8D%B5%E6%9A%97%E5%8F%B7)
- [共通鍵暗号（秘密鍵暗号 / 共有鍵暗号）とは - 意味をわかりやすく - IT用語辞典 e-Words](https://e-words.jp/w/%E5%85%B1%E9%80%9A%E9%8D%B5%E6%9A%97%E5%8F%B7.html)
- [RC4 - Wikipedia](https://ja.wikipedia.org/wiki/RC4)
- [【暗号化】ブロック暗号のモードまとめ (比較表付き) - Qiita](https://qiita.com/omiso/items/6082b765c1257b71985b)
