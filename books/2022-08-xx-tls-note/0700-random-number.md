---
title: "乱数"
---

乱数はランダムな数列のことで、生成された乱数を秘密鍵などで使用するため、セキュリティの全ては乱数生成器の品質にかかってきます。
周期性や統計的な偏りがなく、予測不可能であることが理想な乱数である。

真正乱数生成器が理想ではあるが、実際には疑似乱数生成器 (PRNG) を信頼して使っている。
真正乱数生成器から得られる少量のデータ (シード) から疑似乱数を生成している。
暗号学的な疑似乱数生正規 ([CSPRNG](https://ja.wikipedia.org/wiki/%E6%9A%97%E5%8F%B7%E8%AB%96%E7%9A%84%E6%93%AC%E4%BC%BC%E4%B9%B1%E6%95%B0%E7%94%9F%E6%88%90%E5%99%A8)) には予測不可能であることも必要になる。

## /dev/random と /dev/urandom

> urandom は "unlocked" random source の略です。
> 
> https://pentan.info/server/dev_random_urandom.html

- [/dev/random と /dev/urandom の違い - \[サーバー + サーバー\] ぺんたん info](https://pentan.info/server/dev_random_urandom.html)

## 乱数生成における欠陥の事例

乱数生成はセキュリティ上非常に重要な役割を持っているため、欠陥がそのまま重大なセキュリティ上の驚異になります。

### Netscape Navigator における RNG の欠陥 (1994年)

「プロフェッショナルSSL/TLS P156」より

- ブートからの経過時間 (マイクロ秒) とプロセスIDを元に、単純なアルゴリズムで乱数を生成していた。
- 20ビット程度のセキュリティしかなく、当時のハードウェアでも、わずか25秒で破れてしまう。

### Debian における RNG の欠陥 (2006年)

「プロフェッショナルSSL/TLS P157」より

- 不注意により乱数生成のコードを一行コメントアウトしたことで、プロセスIDから得られる補助的なエントロピーのみで乱数を生成していた
- 16ビット程度のセキュリティしかなくなってしまった。

## Links

- [真性乱数生成器 vs 疑似乱数生成器 - wolfSSL](https://www.wolfssl.jp/wolfblog/2021/08/16/true-random-vs-pseudorandom-number-generation/)
