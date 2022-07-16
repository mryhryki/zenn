---
title: "Client Hello と Server Hello の中身を考察する"
---

https://www.google.co.jp/ に Google Chrome 103 でアクセスした際のパケットを [Wireshark](https://www.wireshark.org/) でキャプチャしてみた結果を考察してみました。

# Client Hello

## パケットの内容

```
Frame 1: 659 bytes on wire (5272 bits), 659 bytes captured (5272 bits) on interface en0, id 0
Ethernet II, Src: Apple_0c:aa:a1 (bc:d0:74:0c:aa:a1), Dst: ASUSTekC_9d:ea:20 (04:d9:f5:9d:ea:20)
Internet Protocol Version 4, Src: 192.168.50.247, Dst: 172.217.175.110
Transmission Control Protocol, Src Port: 57705, Dst Port: 443, Seq: 1, Ack: 1, Len: 593
Transport Layer Security
    TLSv1.3 Record Layer: Handshake Protocol: Client Hello
        Content Type: Handshake (22)
        Version: TLS 1.0 (0x0301)
        Length: 588
        Handshake Protocol: Client Hello
            Handshake Type: Client Hello (1)
            Length: 584
            Version: TLS 1.2 (0x0303)
            Random: 87f4080f12c00236ae32a3cbd4a5050e270a62f8b3aca6debaf68d846de6da48
            Session ID Length: 32
            Session ID: 3620f74083bab3ab079abe6f6476ff29ffa3897b32b4e700202ff090ce7c21ff
            Cipher Suites Length: 32
            Cipher Suites (16 suites)
                Cipher Suite: Reserved (GREASE) (0xfafa)
                Cipher Suite: TLS_AES_128_GCM_SHA256 (0x1301)
                Cipher Suite: TLS_AES_256_GCM_SHA384 (0x1302)
                Cipher Suite: TLS_CHACHA20_POLY1305_SHA256 (0x1303)
                Cipher Suite: TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 (0xc02b)
                Cipher Suite: TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 (0xc02f)
                Cipher Suite: TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 (0xc02c)
                Cipher Suite: TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 (0xc030)
                Cipher Suite: TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256 (0xcca9)
                Cipher Suite: TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256 (0xcca8)
                Cipher Suite: TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA (0xc013)
                Cipher Suite: TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA (0xc014)
                Cipher Suite: TLS_RSA_WITH_AES_128_GCM_SHA256 (0x009c)
                Cipher Suite: TLS_RSA_WITH_AES_256_GCM_SHA384 (0x009d)
                Cipher Suite: TLS_RSA_WITH_AES_128_CBC_SHA (0x002f)
                Cipher Suite: TLS_RSA_WITH_AES_256_CBC_SHA (0x0035)
            Compression Methods Length: 1
            Compression Methods (1 method)
                Compression Method: null (0)
            Extensions Length: 479
            Extension: Reserved (GREASE) (len=0)
                Type: Reserved (GREASE) (56026)
                Length: 0
                Data: <MISSING>
            Extension: server_name (len=21)
                Type: server_name (0)
                Length: 21
                Server Name Indication extension
                    Server Name list length: 19
                    Server Name Type: host_name (0)
                    Server Name length: 16
                    Server Name: ogs.google.co.jp
            Extension: extended_master_secret (len=0)
                Type: extended_master_secret (23)
                Length: 0
            Extension: renegotiation_info (len=1)
                Type: renegotiation_info (65281)
                Length: 1
                Renegotiation Info extension
                    Renegotiation info extension length: 0
            Extension: supported_groups (len=10)
                Type: supported_groups (10)
                Length: 10
                Supported Groups List Length: 8
                Supported Groups (4 groups)
                    Supported Group: Reserved (GREASE) (0x8a8a)
                    Supported Group: x25519 (0x001d)
                    Supported Group: secp256r1 (0x0017)
                    Supported Group: secp384r1 (0x0018)
            Extension: ec_point_formats (len=2)
                Type: ec_point_formats (11)
                Length: 2
                EC point formats Length: 1
                Elliptic curves point formats (1)
                    EC point format: uncompressed (0)
            Extension: session_ticket (len=0)
                Type: session_ticket (35)
                Length: 0
                Data (0 bytes)
            Extension: application_layer_protocol_negotiation (len=14)
                Type: application_layer_protocol_negotiation (16)
                Length: 14
                ALPN Extension Length: 12
                ALPN Protocol
                    ALPN string length: 2
                    ALPN Next Protocol: h2
                    ALPN string length: 8
                    ALPN Next Protocol: http/1.1
            Extension: status_request (len=5)
                Type: status_request (5)
                Length: 5
                Certificate Status Type: OCSP (1)
                Responder ID list Length: 0
                Request Extensions Length: 0
            Extension: signature_algorithms (len=18)
                Type: signature_algorithms (13)
                Length: 18
                Signature Hash Algorithms Length: 16
                Signature Hash Algorithms (8 algorithms)
                    Signature Algorithm: ecdsa_secp256r1_sha256 (0x0403)
                        Signature Hash Algorithm Hash: SHA256 (4)
                        Signature Hash Algorithm Signature: ECDSA (3)
                    Signature Algorithm: rsa_pss_rsae_sha256 (0x0804)
                        Signature Hash Algorithm Hash: Unknown (8)
                        Signature Hash Algorithm Signature: SM2 (4)
                    Signature Algorithm: rsa_pkcs1_sha256 (0x0401)
                        Signature Hash Algorithm Hash: SHA256 (4)
                        Signature Hash Algorithm Signature: RSA (1)
                    Signature Algorithm: ecdsa_secp384r1_sha384 (0x0503)
                        Signature Hash Algorithm Hash: SHA384 (5)
                        Signature Hash Algorithm Signature: ECDSA (3)
                    Signature Algorithm: rsa_pss_rsae_sha384 (0x0805)
                        Signature Hash Algorithm Hash: Unknown (8)
                        Signature Hash Algorithm Signature: Unknown (5)
                    Signature Algorithm: rsa_pkcs1_sha384 (0x0501)
                        Signature Hash Algorithm Hash: SHA384 (5)
                        Signature Hash Algorithm Signature: RSA (1)
                    Signature Algorithm: rsa_pss_rsae_sha512 (0x0806)
                        Signature Hash Algorithm Hash: Unknown (8)
                        Signature Hash Algorithm Signature: Unknown (6)
                    Signature Algorithm: rsa_pkcs1_sha512 (0x0601)
                        Signature Hash Algorithm Hash: SHA512 (6)
                        Signature Hash Algorithm Signature: RSA (1)
            Extension: signed_certificate_timestamp (len=0)
                Type: signed_certificate_timestamp (18)
                Length: 0
            Extension: key_share (len=43)
                Type: key_share (51)
                Length: 43
                Key Share extension
                    Client Key Share Length: 41
                    Key Share Entry: Group: Reserved (GREASE), Key Exchange length: 1
                        Group: Reserved (GREASE) (35466)
                        Key Exchange Length: 1
                        Key Exchange: 00
                    Key Share Entry: Group: x25519, Key Exchange length: 32
                        Group: x25519 (29)
                        Key Exchange Length: 32
                        Key Exchange: 73bb19d4cb10783de701d237b44e8c4abc3c924c652cc854765c7c5394509657
            Extension: psk_key_exchange_modes (len=2)
                Type: psk_key_exchange_modes (45)
                Length: 2
                PSK Key Exchange Modes Length: 1
                PSK Key Exchange Mode: PSK with (EC)DHE key establishment (psk_dhe_ke) (1)
            Extension: supported_versions (len=7)
                Type: supported_versions (43)
                Length: 7
                Supported Versions length: 6
                Supported Version: Reserved (GREASE) (0xaaaa)
                Supported Version: TLS 1.3 (0x0304)
                Supported Version: TLS 1.2 (0x0303)
            Extension: compress_certificate (len=3)
                Type: compress_certificate (27)
                Length: 3
                Algorithms Length: 2
                Algorithm: brotli (2)
            Extension: application_settings (len=5)
                Type: application_settings (17513)
                Length: 5
                ALPS Extension Length: 3
                Supported ALPN List
                    Supported ALPN Length: 2
                    Supported ALPN: h2
            Extension: Reserved (GREASE) (len=1)
                Type: Reserved (GREASE) (43690)
                Length: 1
                Data: 00
            Extension: pre_shared_key (len=275)
                Type: pre_shared_key (41)
                Length: 275
                Pre-Shared Key extension
                    Identities Length: 238
                    PSK Identity (length: 232)
                        Identity Length: 232
                        Identity: 018c8547d1771021ad871871d3cb853e6fb91606366a7b4281d3d1c0c7746ebf0868042d…
                        Obfuscated Ticket Age: 661915059
                    PSK Binders length: 33
                    PSK Binders
            [JA3 Fullstring: 771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-17513-41,29-23-24,0]
            [JA3: 598872011444709307b861ae817a4b60]
```

## 考察

### Version

値が `TLS 1.0 (0x0301)` に設定されています。

これは、ファイヤーウォールのようなミドルボックスによってトラフィックが破棄されることを防ぐため対策のようです。
TLS.1.3 ではこのフィールドは使われていません。
(詳細は「プロフェッショナルSSL/TLS PDF版 付録A P491」参照)

RFC 8446 でも `ProtocolVersion: legacy_version = 0x0303` と定義されています。

> struct {
>   ProtocolVersion legacy_version = 0x0303;    /* TLS v1.2 */
>   Random random;
> ...
> 
> https://datatracker.ietf.org/doc/html/rfc8446#section-4.1.2

`legacy_version` の説明には `TLS 1.2 (0x0303)` を設定されなければならない (MUST) と書かれています。

> legacy_version: (中略) In TLS 1.3, the client indicates its version preferences in the "supported_versions" extension (Section 4.2.1) and the legacy_version field MUST be set to 0x0303, which is the version number for TLS 1.2. TLS 1.3 ClientHellos are identified as having a legacy_version of 0x0303 and a supported_versions extension present with 0x0304 as the highest version indicated therein.
> (See Appendix D for details about backward compatibility.)
> 
> https://datatracker.ietf.org/doc/html/rfc8446#section-4.1.2

ただし ClientHello については、と完成の目的のため `TLS 1.0 (0x0301)` にしても良い (MAY) と書かれているので、Google Chrome は `TLS 1.0 (0x0301)` としているようです。

> legacy_record_version:  MUST be set to 0x0303 for all records generated by a TLS 1.3 implementation other than an initial ClientHello (i.e., one not generated after a HelloRetryRequest), where it MAY also be 0x0301 for compatibility purposes.
> 
> https://datatracker.ietf.org/doc/html/rfc8446#section-5.1

# Server Hello

## パケットの内容

```
Frame 2: 278 bytes on wire (2224 bits), 278 bytes captured (2224 bits) on interface en0, id 0
Ethernet II, Src: ASUSTekC_9d:ea:20 (04:d9:f5:9d:ea:20), Dst: Apple_0c:aa:a1 (bc:d0:74:0c:aa:a1)
Internet Protocol Version 4, Src: 172.217.175.110, Dst: 192.168.50.247
Transmission Control Protocol, Src Port: 443, Dst Port: 57705, Seq: 1, Ack: 594, Len: 212
Transport Layer Security
    TLSv1.3 Record Layer: Handshake Protocol: Server Hello
        Content Type: Handshake (22)
        Version: TLS 1.2 (0x0303)
        Length: 128
        Handshake Protocol: Server Hello
            Handshake Type: Server Hello (2)
            Length: 124
            Version: TLS 1.2 (0x0303)
            Random: 361f8dd6592a64415bc8c63bea1de10205573b4eba71f6ba19e51c31cb61dee4
            Session ID Length: 32
            Session ID: 3620f74083bab3ab079abe6f6476ff29ffa3897b32b4e700202ff090ce7c21ff
            Cipher Suite: TLS_AES_128_GCM_SHA256 (0x1301)
            Compression Method: null (0)
            Extensions Length: 52
            Extension: pre_shared_key (len=2)
                Type: pre_shared_key (41)
                Length: 2
                Pre-Shared Key extension
                    Selected Identity: 0
            Extension: key_share (len=36)
                Type: key_share (51)
                Length: 36
                Key Share extension
                    Key Share Entry: Group: x25519, Key Exchange length: 32
                        Group: x25519 (29)
                        Key Exchange Length: 32
                        Key Exchange: 4f5cc41e2f79ce0ced10c96988c599e2dbd235726f11b1fa06cf7a447e827a48
            Extension: supported_versions (len=2)
                Type: supported_versions (43)
                Length: 2
                Supported Version: TLS 1.3 (0x0304)
            [JA3S Fullstring: 771,4865,41-51-43]
            [JA3S: 2b0648ab686ee45e0e7c35fcfb0eea7e]
    TLSv1.3 Record Layer: Change Cipher Spec Protocol: Change Cipher Spec
        Content Type: Change Cipher Spec (20)
        Version: TLS 1.2 (0x0303)
        Length: 1
        Change Cipher Spec Message
    TLSv1.3 Record Layer: Application Data Protocol: http-over-tls
        Opaque Type: Application Data (23)
        Version: TLS 1.2 (0x0303)
        Length: 68
        Encrypted Application Data: fd4cee13e6519225b320e9e2d69f2b5d5f404a2195871798540020f63d1729280ef43732…
        [Application Data Protocol: http-over-tls]
```

## 考察

### Change Cipher Spec Protocol

過去との互換性を保つためだけに送信されていて、実際には無視されるようです。

> クライアントもサーバもChange Cipher Specプロトコルの各メッセージを送信することは可能ですが、受信側ではそのメッセージは無視されます。
> 
> プロフェッショナルSSL/TLS PDF版 付録A P495


# Change Cipher Spec Protocol (Client -> Server)

Server Hello と同様に、互換性のために送信しているようです。

```
Frame 3: 130 bytes on wire (1040 bits), 130 bytes captured (1040 bits) on interface en0, id 0
Ethernet II, Src: Apple_0c:aa:a1 (bc:d0:74:0c:aa:a1), Dst: ASUSTekC_9d:ea:20 (04:d9:f5:9d:ea:20)
Internet Protocol Version 4, Src: 192.168.50.247, Dst: 172.217.175.110
Transmission Control Protocol, Src Port: 57705, Dst Port: 443, Seq: 594, Ack: 213, Len: 64
Transport Layer Security
    TLSv1.3 Record Layer: Change Cipher Spec Protocol: Change Cipher Spec
        Content Type: Change Cipher Spec (20)
        Version: TLS 1.2 (0x0303)
        Length: 1
        Change Cipher Spec Message
    TLSv1.3 Record Layer: Application Data Protocol: http-over-tls
        Opaque Type: Application Data (23)
        Version: TLS 1.2 (0x0303)
        Length: 53
        Encrypted Application Data: 0e43c760751e98b23b4b90981fb881b2a2077a67478b6ecd0c3bcfd2ab09f5f8345b3bff…
        [Application Data Protocol: http-over-tls]
```
