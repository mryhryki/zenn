---
title: April 2021 Security Releases (Node.js)
created_at: 2021-05-04T10:00:00+09:00
---

## はじめに

[April 2021 Security Releases | Node.js](https://nodejs.org/en/blog/vulnerability/april-2021-security-releases/)

この内容をざっくりと自分用に内容をチェックする。
（正確な情報は上記のリンクを参照してください。あくまでメモです）

## OpenSSL - CA certificate check bypass with X509_V_FLAG_X509_STRICT (High) (CVE-2021-3450)

非CA証明書から発行された証明書を無効化するチェックがバイパスされてしまう。

（正しくない証明書がチェックを通過してしまう危険性がある）

## OpenSSL - NULL pointer deref in signature_algorithms processing (High) (CVE-2021-3449)

(悪意ある) renegotiation ClientHello メッセージが送信されると OpenSSL TLS サーバがクラッシュする可能性がある。
サーバーとして使う場合のみのよう。


## npm upgrade - Update y18n to fix Prototype-Pollution (High) (CVE-2020-7774)

プロトタイプ汚染が発生する。

> y18n (npm) Affected versions
> < 3.2.2
> = 4.0.0
> \>= 5.0.0, < 5.0.5

ちょっと古めの npm かな。


---

## OpenSSL に起因する脆弱性の情報

https://www.openssl.org/news/secadv/20210325.txt

### 原文

> OpenSSL Security Advisory [25 March 2021]
> =========================================
> 
> CA certificate check bypass with X509_V_FLAG_X509_STRICT (CVE-2021-3450)
> ========================================================================
> 
> Severity: High
> 
> The X509_V_FLAG_X509_STRICT flag enables additional security checks of the
> certificates present in a certificate chain. It is not set by default.
> 
> Starting from OpenSSL version 1.1.1h a check to disallow certificates in
> the chain that have explicitly encoded elliptic curve parameters was added
> as an additional strict check.
> 
> An error in the implementation of this check meant that the result of a
> previous check to confirm that certificates in the chain are valid CA
> certificates was overwritten. This effectively bypasses the check
> that non-CA certificates must not be able to issue other certificates.
> 
> If a "purpose" has been configured then there is a subsequent opportunity
> for checks that the certificate is a valid CA.  All of the named "purpose"
> values implemented in libcrypto perform this check.  Therefore, where
> a purpose is set the certificate chain will still be rejected even when the
> strict flag has been used. A purpose is set by default in libssl client and
> server certificate verification routines, but it can be overridden or
> removed by an application.
> 
> In order to be affected, an application must explicitly set the
> X509_V_FLAG_X509_STRICT verification flag and either not set a purpose
> for the certificate verification or, in the case of TLS client or server
> applications, override the default purpose.
> 
> OpenSSL versions 1.1.1h and newer are affected by this issue. Users of these
> versions should upgrade to OpenSSL 1.1.1k.
> 
> OpenSSL 1.0.2 is not impacted by this issue.
> 
> This issue was reported to OpenSSL on 18th March 2021 by Benjamin Kaduk
> from Akamai and was discovered by Xiang Ding and others at Akamai. The fix was
> developed by Tomáš Mráz.
> 
> 
> NULL pointer deref in signature_algorithms processing (CVE-2021-3449)
> =====================================================================
> 
> Severity: High
> 
> An OpenSSL TLS server may crash if sent a maliciously crafted renegotiation
> ClientHello message from a client. If a TLSv1.2 renegotiation ClientHello omits
> the signature_algorithms extension (where it was present in the initial
> ClientHello), but includes a signature_algorithms_cert extension then a NULL
> pointer dereference will result, leading to a crash and a denial of service
> attack.
> 
> A server is only vulnerable if it has TLSv1.2 and renegotiation enabled (which
> is the default configuration). OpenSSL TLS clients are not impacted by this
> issue.
> 
> All OpenSSL 1.1.1 versions are affected by this issue. Users of these versions
> should upgrade to OpenSSL 1.1.1k.
> 
> OpenSSL 1.0.2 is not impacted by this issue.
> 
> This issue was reported to OpenSSL on 17th March 2021 by Nokia. The fix was
> developed by Peter Kästle and Samuel Sapalski from Nokia.
> 
> Note
> ====
> 
> OpenSSL 1.0.2 is out of support and no longer receiving public updates. Extended
> support is available for premium support customers:
> https://www.openssl.org/support/contracts.html
> 
> OpenSSL 1.1.0 is out of support and no longer receiving updates of any kind.
> The impact of these issues on OpenSSL 1.1.0 has not been analysed.
> 
> Users of these versions should upgrade to OpenSSL 1.1.1.
> 
> References
> ==========
> 
> URL for this Security Advisory:
> https://www.openssl.org/news/secadv/20210325.txt
> 
> Note: the online version of the advisory may be updated with additional details
> over time.
> 
> For details of OpenSSL severity classifications please see:
> https://www.openssl.org/policies/secpolicy.html


### DeepL 翻訳


> OpenSSL セキュリティ・アドバイザリー [2021年3月25日]
> =========================================
> 
> X509_V_FLAG_X509_STRICT による CA 証明書チェックのバイパス (CVE-2021-3450)
> ========================================================================
> 
> 深刻度: 高
> 
> X509_V_FLAG_X509_STRICT フラグは、証明書チェーンに存在する証明書の追加のセキュリティチェックを可能にします。フラグは、証明書チェーンに存在する証明書の追加のセキュリティチェックを可能にします。このフラグはデフォルトでは設定されていません。
> 
> OpenSSL バージョン 1.1.1h 以降では、チェーン内の証明書のうち、明示的にコード化された 楕円曲線パラメータを明示的にエンコードしたチェーンの証明書を許可しないチェックが追加されました。追加の厳密なチェックとして追加されました。
> 
> このチェックの実装に誤りがあったため、チェイン内の証明書が明示的にエンコードされているかどうかを確認する以前のチェックの結果である チェーン内の証明書が有効なCA証明書であることを確認する以前のチェックの結果が上書きされていました。証明書であることを確認する以前のチェックの結果が上書きされていました。これにより、非CA証明書を使用してはならないという これにより、非CA証明書が他の証明書を発行できないようにするというチェックが事実上バイパスされます。
> 
> 目的」が設定されている場合は、その証明書が有効な証明書であるかどうかを確認するために、次のような機会があります。その証明書が有効なCAであるかどうかをチェックする機会があります。 libcryptoに実装されている名前付きの「purpose」値はすべて 値はすべて、このチェックを行います。 したがって 目的が設定されている場合、strictフラグが使用されていても、証明書チェーンは拒否される。strictフラグが使用されていても、証明書チェーンは拒否されます。libsslのクライアントおよびサーバーの証明書検証ルーチンでは、デフォルトでpurposeが設定されています。サーバ証明書検証ルーチンではデフォルトでpurposeが設定されていますが、アプリケーションによって
> が設定されていますが、アプリケーションによって上書きされたり削除されたりすることがあります。
> 
> 影響を受けるためには、アプリケーションが明示的に X509_V_FLAG_X509_STRICT 検証フラグを明示的に設定し、証明書検証に目的を設定しないか、または 証明書検証の目的を設定しないか、TLS クライアントまたはサーバー・アプリケーションの場合は、デフォルトの目的をオーバーライドする必要があります。アプリケーションの場合は、デフォルトの目的を上書きする必要があります。
> 
> この問題は、OpenSSLのバージョン1.1.1h以降で発生します。これらのバージョンのユーザーは は OpenSSL 1.1.1k にアップグレードしてください。
> 
> OpenSSL 1.0.2 は、この問題の影響を受けません。
> 
> この問題は、2021年3月18日にアカマイのBenjamin Kaduk氏がOpenSSLに報告し によって報告され、Akamai の Xiang Ding 氏らによって発見されました。修正プログラムは Tomáš Mráz 氏によって開発されました。
> 
> 
> signature_algorithms の処理における NULL ポインタの参照 (CVE-2021-3449)
> =====================================================================
> 
> 深刻度：高
> 
> OpenSSL TLS サーバは、クライアントから悪意を持って作成された renegotiation ClientHello メッセージがクライアントから送られると、OpenSSL TLS サーバがクラッシュする可能性があります。TLSv1.2 の renegotiation ClientHello が以下を省略すると TLSv1.2 の再交渉用 ClientHello が signature_algorithms 拡張を省略し（初期の ClientHello には存在していました）、その一方で 最初の ClientHello に含まれていた） signature_algorithms エクステンションを省略し、 signature_algorithms_cert エクステンションを含んでいた場合、NULLポインタの参照が発生します。ポインタの参照が発生し、クラッシュやサービス拒否の原因となります。攻撃を受けてしまいます。
> 
> サーバーが脆弱なのは、TLSv1.2 と renegotiation が有効になっている場合のみです（これはデフォルト設定です）。デフォルトの設定です）。) OpenSSLのTLSクライアントは、この問題の影響を受けません。この問題の影響はありません。
> 
> OpenSSL 1.1.1のすべてのバージョンがこの問題の影響を受けます。これらのバージョンのユーザーは は、OpenSSL 1.1.1k にアップグレードしてください。
> 
> OpenSSL 1.0.2 は、この問題の影響を受けません。
> 
> この問題は、2021年3月17日にNokia社からOpenSSLに報告されました。修正プログラムは Nokia社のPeter Kästle氏とSamuel Sapalski氏によって開発されました。
> 
> 備考
> ====
> 
> OpenSSL 1.0.2はサポートが終了し、パブリックアップデートが受けられなくなりました。Extended プレミアムサポートのお客様には延長サポートがあります。
> https://www.openssl.org/support/contracts.html
> 
> OpenSSL 1.1.0 はサポートを終了し、いかなる種類の更新も受けられなくなりました。これらの問題が OpenSSL 1.1.0 に与える影響は分析されていません。
> 
> これらのバージョンをお使いの方は、OpenSSL 1.1.1にアップグレードしてください。
> 
> 参考文献
> ==========
> 
> 本セキュリティアドバイザリのURLです。
> https://www.openssl.org/news/secadv/20210325.txt
> 
> このセキュリティ勧告のオンライン版は、時間の経過とともに追加情報が更新される可能性があります。勧告のオンライン版が更新される可能性があります。
> 
> OpenSSLの深刻度分類の詳細については、以下をご覧ください。
> https://www.openssl.org/policies/secpolicy.html
> 
> 
> www.DeepL.com/Translator（無料版）で翻訳しました。

