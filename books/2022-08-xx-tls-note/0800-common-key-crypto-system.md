---
title: "共通鍵暗号"
---

共通鍵暗号（または秘密鍵暗号、対象鍵暗号とも）方式とは、通信相手と **事前に共有した** 秘密鍵を用いて暗号化・複合を行う暗号方式。
公開鍵暗号に比べて高速に暗号化・複合が行えるが、秘密鍵の交換を安全に行う方法が課題である。
そのため共通鍵暗号で使う秘密鍵を公開鍵暗号方式で交換し、実際のデータはその秘密鍵を使用して暗号化するというように、両方を組み合わせて使う場合もある。

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
しかし、現在では既に安全ではないとされ、[RFC 7465](https://datatracker.ietf.org/doc/html/rfc7465) により禁止された。

## ChaCha20

[RFC 7539](https://datatracker.ietf.org/doc/html/rfc7539) で定義されている。
Salsa20 というストリーム暗号の変種らしい。

[Salsa20 - Wikipedia](https://ja.wikipedia.org/wiki/Salsa20#ChaCha)

TLS 1.3 で唯一定義されているストリーム暗号であり、暗号としてもある程度普及しているよう。

> 現在実用的に広く使えるTLSの対称暗号が実質AESの一択しかない。
> (略)
> こんな状況でもし今、AESに重大な問題が見つかったらとしたらどうなるか？ TLSの運用者は非常に厳しい選択に迫られます。対称暗号以外ではTLS1.2において、認証は RSA/ECDSA, 鍵交換は DHE/ECDHEと2つ以上の仕組みが存在します。リスク管理の観点から、現実的に代用できるAESのバックアップを持つことが今のTLSに必要です。
> https://jovi0608.hatenablog.com/entry/20160404/1459748671

この意味合いも大きそう。

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

# 暗号利用モード

> 暗号利用モード（あんごうりようモード、Block cipher modes of operation）とは、ブロック暗号を利用して、ブロック長よりも長いメッセージを暗号化するメカニズムのことである。
> 
> https://ja.wikipedia.org/wiki/%E6%9A%97%E5%8F%B7%E5%88%A9%E7%94%A8%E3%83%A2%E3%83%BC%E3%83%89

ブロック暗号方式で、暗号化したいデータが鍵長よりも長い場合、繰り返し暗号を適用する必要がある。
最初に紹介する ECB モードのように単純な繰り返しだと問題が生じる場合があるため、他のモードが作られた。

## ECB (Electronic Codebook Mode)

単純にブロックごとに同じ秘密鍵で暗号化する方式。
同じ内容のブロックを暗号した場合、同じ暗号データが出力されるためパターンを隠すことができず推奨されない。

以下の Wikipedia で紹介されていた図が分かりやすい。
（注釈も書かれているが、画像がランダムなノイズのように変換されたことが安全であることを示すわけではないことに注意）

![ECBモードで画像を暗号化した場合の例 (Wikipedia より)](https://mryhryki.com/file/UhMCISC8X5rtuQtZ4uNY3FjCTHN0lVASg2pZy1Hq7470dUxw.png)

https://ja.wikipedia.org/wiki/%E6%9A%97%E5%8F%B7%E5%88%A9%E7%94%A8%E3%83%A2%E3%83%BC%E3%83%89#Electronic_Codebook_(ECB)

## CBC (Cipher Block Chaining)

CBC は IV (Initial Vector) と前のブロックの暗号化の結果を使用して、同じ内容のブロックを暗号した場合でも別の暗号データを出力できるようにしたモードである。

![CBCモードでの暗号化 (Wikipedia より)](https://mryhryki.com/file/Uf1loMP4IzUSErmkU_WkwxlNMHeKCGhPE8u7pwKP-6dymg00.jpeg)

https://ja.wikipedia.org/wiki/%E6%9A%97%E5%8F%B7%E5%88%A9%E7%94%A8%E3%83%A2%E3%83%BC%E3%83%89#Cipher_Block_Chaining_(CBC)

欠点としては、前のブロックの暗号化の結果がないと次のブロックが暗号化できないので、暗号化処理を並列化することができない。

## CTR (Counter)

> CTRモード (Counter Mode) は、ブロック暗号を同期型のストリーム暗号として扱うものである。integer counter mode (ICM) あるいは segmented integer counter mode (SIC) とも呼ばれる。
> 
> https://ja.wikipedia.org/wiki/%E6%9A%97%E5%8F%B7%E5%88%A9%E7%94%A8%E3%83%A2%E3%83%BC%E3%83%89#Counter_(CTR)

各ブロックと単調増加するカウンターを組み合わせて暗号化する方式。
前後に関連がないため、暗号化・復号ともに並列化することが可能。

![CTRモードでの暗号化 (Wikipedia より)](https://mryhryki.com/file/Uf1mS3binlkKo45oczVtmCNRt_pkFSip_1mmLZWa4a6xNxRs.jpeg)

https://ja.wikipedia.org/wiki/%E6%9A%97%E5%8F%B7%E5%88%A9%E7%94%A8%E3%83%A2%E3%83%BC%E3%83%89#Counter_(CTR)

## CBC-MAC (Cipher Block Chaining Message Authentication Code)

CBCモードを使い、MACを生成する方式。
(MAC については「ハッシュ関数」の章を参照)

暗号化を行うものではないので注意。
また CBC を使うため、並列計算はできない。

![CBC-MACモードでの暗号化 (Wikipedia より)](https://mryhryki.com/file/Uf1oElWT7YiTqYb6AqsihU8oAlfPatPWAvcwlBlHLPeepUFg.jpeg)

https://ja.wikipedia.org/wiki/CBC-MAC

## CCM (Counter with CBC-MAC)

CTR (Counter) と CBC-MAC を組み合わせた方式。
CTR を使い暗号化を行いつつ、CBC-MAC を使い認証を行う。

## GCM (Galois/Counter Mode)

> 名称が示すように、GCMは暗号化としてCTRモードを、認証として新しいGalois modeを組み合わせたものである。
> https://ja.wikipedia.org/wiki/Galois/Counter_Mode

CCM に似て CTR (Counter) モードを利用した暗号化と、と認証 (Galois) を組み合わせた方式。
認証タグと呼ばれるハッシュ値のような値により、暗号化された内容を検証することが可能になる。
CTR (Counter) モードを使用するため、並列計算が可能。

![GCMモードでの暗号化 (Wikipedia より)](https://mryhryki.com/file/Uf1wREF4qqirjdHHDpD_x3E3FWOoELT0p73PciFztE_pE_ig.jpeg)

https://ja.wikipedia.org/wiki/Galois/Counter_Mode

[筆者感想]
並列計算が可能でパフォーマンスが良く、[特許による妨げもない](https://ja.wikipedia.org/wiki/Galois/Counter_Mode#%E7%89%B9%E8%A8%B1) ため、現状では GCM が最も使うべき暗号モードのように思えた。

# 参考リンク

- [共通鍵暗号 - Wikipedia](https://ja.wikipedia.org/wiki/%E5%85%B1%E9%80%9A%E9%8D%B5%E6%9A%97%E5%8F%B7)
- [共通鍵暗号（秘密鍵暗号 / 共有鍵暗号）とは - 意味をわかりやすく - IT用語辞典 e-Words](https://e-words.jp/w/%E5%85%B1%E9%80%9A%E9%8D%B5%E6%9A%97%E5%8F%B7.html)
- [RC4 - Wikipedia](https://ja.wikipedia.org/wiki/RC4)
- [【暗号化】ブロック暗号のモードまとめ (比較表付き) - Qiita](https://qiita.com/omiso/items/6082b765c1257b71985b)
- [新しいTLSの暗号方式ChaCha20-Poly1305 - ぼちぼち日記](https://jovi0608.hatenablog.com/entry/20160404/1459748671)
