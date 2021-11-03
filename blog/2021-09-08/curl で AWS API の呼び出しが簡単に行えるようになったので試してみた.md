# curl で AWS API の呼び出しが簡単に行えるようになったので試してみた


## 情報元

![capture.png](https://i.gyazo.com/99034927ec9765d906d6a3fb9d66bb9c.png)

> url 7.75.0 から "--aws-sigv4" フラグが使えるようになってるっぽい！ テストとかで AWS の API を呼び出すのがやりやすくなりそうだ〜これは嬉しい〜🎉💝🎁🎂🎈🥳🎊 / "curl 7.75.0 is smaller | https://t.co/uTssjSA20z" https://t.co/N3EgXIH2T7 https://t.co/ClokV45rz6

https://twitter.com/toricls/status/1435133865857667079


## 試してみた（Gist）

[cURL の --aws-sigv4 オプションで AWS API にリクエストするサンプル（STSの一時的な認証情報を使用する場合）](https://gist.github.com/mryhryki/28fcd54e8a8cdffb78462d171ce48b27)

```bash
REGION="ap-northeast-1"
SERVICE="lambda"

curl "https://${SERVICE}.${REGION}.amazonaws.com/2015-03-31/functions/" \
  --verbose \
  -H "X-Amz-Security-Token: ${AWS_SESSION_TOKEN}" \
  --aws-sigv4 "aws:amz:${REGION}:${SERVICE}" \
  --user "${AWS_ACCESS_KEY_ID}:${AWS_SECRET_ACCESS_KEY}"
```


### 実行結果

※一部の情報は `xxxx...` でマスクしています。

```bash
$ ./request-aws-api-by-curl.sh
*   Trying 3.112.10.144:443...
* Connected to lambda.ap-northeast-1.amazonaws.com (3.112.10.144) port 443 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
* TLSv1.2 (IN), TLS handshake, Server finished (14):
* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
* TLSv1.2 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.2 (OUT), TLS handshake, Finished (20):
* TLSv1.2 (IN), TLS handshake, Finished (20):
* SSL connection using TLSv1.2 / ECDHE-RSA-AES128-GCM-SHA256
* ALPN, server accepted to use h2
* Server certificate:
*  subject: CN=lambda.ap-northeast-1.amazonaws.com
*  start date: Dec 23 00:00:00 2020 GMT
*  expire date: Jan 21 23:59:59 2022 GMT
*  subjectAltName: host "lambda.ap-northeast-1.amazonaws.com" matched cert's "lambda.ap-northeast-1.amazonaws.com"
*  issuer: C=US; O=Amazon; OU=Server CA 1B; CN=Amazon
*  SSL certificate verify ok.
* Using HTTP2, server supports multiplexing
* Connection state changed (HTTP/2 confirmed)
* Copying HTTP/2 data in stream buffer to connection buffer after upgrade: len=0
* Server auth using AWS_SIGV4 with user 'ASxxxxxxxxxxxxxxxx5P'
* Using Stream ID: 1 (easy handle 0x7ff92c814400)
> GET /2015-03-31/functions/ HTTP/2
> Host: lambda.ap-northeast-1.amazonaws.com
> authorization: AWS4-HMAC-SHA256 Credential=ASxxxxxxxxxxxxxxxx5P/20210908/ap-northeast-1/lambda/aws4_request, SignedHeaders=host;x-amz-date, Signature=afxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx97
> x-amz-date: 20210908T001709Z
> user-agent: curl/7.78.0
> accept: */*
> x-amz-security-token: IQxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxMQ==
>
* Connection state changed (MAX_CONCURRENT_STREAMS == 128)!
< HTTP/2 200
< date: Wed, 08 Sep 2021 00:17:09 GMT
< content-type: application/json
< content-length: 1998
< x-amzn-requestid: 8cxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx12
<
* Connection #0 to host lambda.ap-northeast-1.amazonaws.com left intact
{"Functions":[{"Description":"","TracingConfig":{"Mode":"PassThrough"},"VpcConfig":null,"SigningJobArn":null,"RevisionId":"e9xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx78","LastModified":"2021-09-04T20:06:13.575+0000","FileSystemConfigs":null,"FunctionName":"xxxxxxxxxxx","Runtime":"provided.al2","Version":"$LATEST","PackageType":"Zip","LastUpdateStatus":null,"Layers":null,"FunctionArn":"arn:aws:lambda:ap-northeast-1:xxxxxxxxxxxx:function:test-lambda","KMSKeyArn":null,"MemorySize":128,"ImageConfigResponse":null,"LastUpdateStatusReason":null,"DeadLetterConfig":null,"Timeout":3,"Handler":"xxxxx.xxxxxxx","CodeSha256":"7lQ+/ibw/GuogWOzS1R2YDh63AHaTIwu7HrxEx3T6mQ=","Role":"arn:aws:iam::xxxxxxxxxxxx:role/service-role/xxxxxxxxxxxxxxxxxxxxxxxxx","SigningProfileVersionArn":null,"MasterArn":null,"CodeSize":1520,"State":null,"StateReason":null,"Environment":null,"StateReasonCode":null,"LastUpdateStatusReasonCode":null},{"Description":"","TracingConfig":{"Mode":"PassThrough"},"VpcConfig":{"VpcId":"","SecurityGroupIds":[],"SubnetIds":[]},"SigningJobArn":null,"RevisionId":"e2xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxdc","LastModified":"2021-09-08T00:12:25.190+0000","FileSystemConfigs":null,"FunctionName":"xxxxxxxxxxxxxx","Runtime":"nodejs14.x","Version":"$LATEST","PackageType":"Zip","LastUpdateStatus":null,"Layers":null,"FunctionArn":"arn:aws:lambda:ap-northeast-1:xxxxxxxxxxxx:function:xxxxxxxxxxxxxx","KMSKeyArn":null,"MemorySize":384,"ImageConfigResponse":null,"LastUpdateStatusReason":null,"DeadLetterConfig":null,"Timeout":300,"Handler":"xxxxxxxxxxxxxxxxxx","CodeSha256":"eIQAuO10X6mwnkxcPXoGZAKLkjcDK21TEG8RVLIOZ1I=","Role":"arn:aws:iam::xxxxxxxxxxxx:role/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx","SigningProfileVersionArn":null,"MasterArn":null,"CodeSize":2142566,"State":null,"StateReason":null,"Environment":{"Variables":{xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx},"Error":null},"StateReasonCode":null,"LastUpdateStatusReasonCode":null}],"NextMarker":null}
```

ちゃんと取れました。