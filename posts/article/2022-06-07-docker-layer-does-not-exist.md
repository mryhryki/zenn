---
title: Docker ビルド時に "layer does not exist" が出たときの原因と対応方法
---

## はじめに

Docker ビルドで謎のエラーが出たので、それの原因と対応方法をメモします。


## エラーの内容

Docker ビルドをしていると、単純な `COPY` でエラーが出てしまいます。
（一部の値をダミー化しています）

```shell
$ docker build (略) .

...(略)...

 ---> xxxxxxxxxxxx
Step 16/35 : COPY ./some/dir/path /tmp/
failed to export image: failed to create image: failed to get layer sha256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx: layer does not exist
Error: Process completed with exit code 1.
```

単純な `COPY` なので、原因が全くわからない状況でした。

ちなみに、CI を Travis CI から GitHub Actions に移行する作業中に発生しました。
Travis CI で実行した時は特にエラーが出ていませんでした。


## 原因

Stack Overflow で見つけました。

> This problem occurs with a specific sequence of COPY commands in a multistage build.
> 
> More precisely, the bug triggers when there is a COPY instruction producing null effect (for example if the content copied is already present in the destination, with 0 diff), followed immediately by another COPY instruction.
>
> https://stackoverflow.com/a/62409523

DeepL で翻訳すると、以下のようになります。

> この問題は、多段ビルドにおいて、特定のCOPYコマンドのシーケンスで発生します。
> 
> より正確には、効果がないCOPY命令（例えば、コピーされたコンテンツがコピー先に既に存在し、差分が0である場合）があり、その直後に別のCOPY命令を実行すると、このバグが発生します。

書いてあるとおり、差分のない `COPY` を実行した直後に、また `COPY` を実行すると、このエラーが発生するようです。

実際確認してみると、直前に意味のない `COPY` の実行があり、これが原因でした。

```dockerfile
COPY ./source_dir           ./destination_dir
COPY ./source_dir/file_path ./destination_dir/file_path # 直前でディレクトリごとコピーしているので、この行は不要

COPY ./some/dir/path /tmp/
```

## 対応

この場合、エラーになっている直前の `COPY` が不要だったので、削除して対応しました。

```diff
  COPY ./source_dir           ./destination_dir
- COPY ./source_dir/file_path ./destination_dir/file_path # 直前でディレクトリごとコピーしているので、この行は不要
  
  COPY ./some/dir/path /tmp/
```

これで、無事ビルドが通るようになりました。


## おわりに

こんな単純なもので結構時間をとってしまい悔しいです・・・。

Docker の不具合だと思うんですが、たぶんレイヤーキャッシュとかの関係で同じハッシュになってエラーになっちゃうとかなんですかね。
（あまり詳しくは知らないですが）
意外と根が深くて直らないとかもあるのかもしれません。

とりあえず、同じエラーになった時に時間をかけないように、ここにメモしておきます。
