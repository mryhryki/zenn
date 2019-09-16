---
layout: blog
header_image: blog
title: macOS のターミナル(CLI)で手軽に暗号化 (OpenSSL + AWS CLI)
keyword: macOS,OpenSSL,AWS KMS
---

ターミナルとかで、ファイルを手軽に暗号化/復号したいと思ったことはありませんか？私はあります。

そんな時に使った方法を紹介します。

## OpenSSL を使ったファイルの暗号化/複合

macOS であれば、特に何も用意しなくても使えるはずです。

### 暗号化

```bash
$ openssl aes-256-cbc -e \
          -in "<暗号化したいファイルのパス>" \
          -out "<出力先のファイルパス>" \
          -pass "file:<暗号化に使用するキーのファイルパス>"
```

### 復号

```bash
$ openssl aes-256-cbc -d \
          -in "<複合化したいファイルのパス>" \
          -out "<出力先のファイルパス>" \
          -pass "file:<復号に使用するキーのファイルパス>"
```

### 実例

実際にパスを入れるとこんな感じです。

```bash
$ openssl aes-256-cbc -e -in "~/secret.txt" -out "~/secret.txt.enc" -pass "file:~/.credential"
$ openssl aes-256-cbc -d -in "~/secret.txt.enc" -out "~/secret.txt" -pass "file:~/.credential"
```

このサンプルの場合 `~/.credential` は暗号化/複合に必要なファイルであり、外部に漏らしてはいけない情報になります。

### おまけ：OpenSSLを使ったランダム文字列の生成

キーとなる情報をどうやって作るか悩んだ時は、OpenSSL を使ってランダムな文字列を生成することも可能です。

```bash
$ oppenssl rand -hex 16
3fb0cd3b25be5d3bc9221c40f5087e45 # 出力される32文字（2倍）になります

$ oppenssl rand -base64 16
fZa/ZwJCb7cIL5O/y3CGag== # 出力される25文字（4/3倍+パディング）になります
```

## AWS KMS を使ったキーの管理

AWSユーザーがあることが前提ですが、キー情報の管理をAWSに任せることでローカルで管理しなくて良くなります。
特にチームで開発する際に、Git に機密情報をコミットしたい場合などには、とても便利だと思います。

### AWS CLI のセットアップ

[公式ドキュメント](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/install-macos.html) や [ブログ記事](https://qiita.com/maimai-swap/items/999eb69b7a4420d6ab64) を参考にインストールします。

設定はこちらの [公式ドキュメント](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-chap-configure.html) を参考にしてください。

### KMS のカスタマー管理型のキーを作成（初回のみ）

AWS CLI を使えばコマンド一発で作成できます。
`KeyId` は暗号化/復号時に使います。

```bash
$ aws kms create-key
{
    "KeyMetadata": {
        "AWSAccountId": "111111111111",
        "KeyId": "11111111-2222-3333-4444-555555555555",
        "Arn": "arn:aws:kms:ap-northeast-1:111111111111:key/11111111-2222-3333-4444-555555555555",
        "CreationDate": 1561636800.000,
        "Enabled": true,
        "Description": "",
        "KeyUsage": "ENCRYPT_DECRYPT",
        "KeyState": "Enabled",
        "Origin": "AWS_KMS",
        "KeyManager": "CUSTOMER"
    }
}
```

### 暗号化（初回のみ）

```bash
$ aws kms encrypt \
      --key-id "<暗号化に使用するキーID>" \
      --plaintext "fileb://<暗号化したいファイルのパス>" \
      --query CiphertextBlob \
      --output text |
    base64 --decode \
        > "<出力先のファイルパス>"
```

### 復号

```bash
$ aws kms decrypt \
      --ciphertext-blob "fileb://<複合化したいファイルのパス>" \
      --query Plaintext \
      --output text |
    base64 --decode \
      > "<出力先のファイルパス>"
```

暗号化の際に、キーの情報も含まれたデータが出力されているので、復号時には `--key-id` を指定する必要はありません。

### 実例

実際にパスを入れるとこんな感じです。

```bash
$ aws kms encrypt \
      --key-id "11111111-2222-3333-4444-555555555555" \
      --plaintext "fileb://~/secret.txt" \
      --query CiphertextBlob \
      --output text |
    base64 --decode \
        > "~/secret.txt.enc"

$ aws kms decrypt \
      --ciphertext-blob "fileb://~/secret.txt.enc" \
      --query Plaintext \
      --output text |
    base64 --decode \
      > "~/secret.txt"
```

### AWS KMS の制限

[公式ドキュメント](https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/overview.html) によれば暗号化/復号可能なデータは最大4KB(4096)バイトまでとあります。

小さめのファイルならダイレクトに暗号化することも可能ですが、暗号化に使用するキー情報の暗号化/復号に使うのが現実的だと思います。

### AWS KMS + OpenSSL を組み合わせた例

#### キー情報の作成

```bash
# 認証情報
$ cat ~/.credential
c2ec8a1b-7574-4ff0-80a2-4aa2e3d7eae0

# キー情報を作成
$ aws kms encrypt \
      --key-id "11111111-2222-3333-4444-555555555555" \
      --plaintext "fileb://~/.credential" \
      --query CiphertextBlob \
      --output text
AQICAHj5KKUSNyyCZcOF... # 長いので省略しています。どこかに記録しておいてください。

# ファイルを暗号化します
$ openssl aes-256-cbc -e -in "~/secret.txt" -out "~/secret.txt.enc" -pass "file:~/.credential"

# この時点で暗号化するための生キーは削除して構いません
rm ~/.credential
```

#### 復号（シェルスクリプトの例）

ちょっと面倒ですが、機密情報が存在しないので、そのままコミットすることも可能なのが便利ですね。
状況が許せば、AWS SDK を使ってプログラミング言語で書いた方がシンプルに書けると思います。

```bash
#!/usr/bin/env bash

# AWS KMS の該当するキーのアクセス権がないと復号できないので、キー情報をコミットしても大丈夫です。
ENCRYPTED_KEY="AQICAHj5KKUSNyyCZcOF..."

TEMP_DIR="/tmp/kms"
mkdir -p "${TEMP_DIR}"

printf "${ENCRYPTED_KEY}" | base64 --decode > "${TEMP_DIR}/bin_key"

aws kms decrypt --ciphertext-blob "fileb://${TEMP_DIR}/bin_key" \
    --query Plaintext \
    --output text |
  base64 --decode > "${TEMP_DIR}/credential"

openssl aes-256-cbc -d \
          -in "${HOME}/secret.txt.enc" \
          -out "${HOME}/secret2.txt" \
          -pass "file:${TEMP_DIR}/credential"

rm -rf "${TEMP_DIR}"
```

## まとめ

ファイルの暗号化は `OpenSSL` で手軽に暗号化できます。
その際に使用するキー情報を `AWS KMS` で管理すると、漏らしてはいけない情報を管理する手間がかなり省けるようになる、という感じでした。
これらを使うと、アプリケーションの機密情報ごと Git で管理することも可能になるので、必要に応じて使っていきたいですね。
