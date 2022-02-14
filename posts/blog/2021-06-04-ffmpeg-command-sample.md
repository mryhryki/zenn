---
title: FFmpeg コマンドメモ
created_at: 2021-06-04T10:00:00+09:00
---

ちょくちょく使うことがあるので、使ったコマンドをメモしておく。

## 時間で切り出す

```shell
# 開始60秒から10秒間だけ切り出す場合
$ ffmpeg -i input.mp4 -ss 60 -t 10  output.mp4
```

## 1280x720 1.5Mbps で出力する

GAM での配信設定で使った設定。

```bash
$ ffmpeg -i input.mp4 -s '1280:720' -b 1.5M output.mp4
```

## avi を mp4 に変換する

```bash
$ ffmpeg -i 'source.avi' -pix_fmt yuv420p 'out.mp4'
```

- YUV402p にしないとプレーヤーによっては再生できないらしい
- 参考資料
    - [ffmpegでaviをmp4に変換するとWindows Media Playerで再生できない？ | urashita.com 浦下.com (ウラシタドットコム)](https://urashita.com/archives/25396)
    - [【備忘録】ffmpegを利用した動画ファイルフォーマット変換 - Qiita](https://qiita.com/mriho/items/a16b3c618c378efeb58f)

## 音声ファイルを mp3 に変換する

音声ファイルを変換することもできた。
色々対応しているけど、とりあえず mp3 のコマンド例だけ。

```bash
$ ffmpeg \
    -i "source.aac" \
    -vn \
    -ac 2 \
    -ar 44100 \
    -ab 256k \
    -acodec libmp3lame \
    -f mp3 \
    "out.mp3"
```

- [[ffmpeg] 音声形式の変換方法まとめ - Qiita](https://qiita.com/suzutsuki0220/items/43c87488b4684d3d15f6#wav%E3%81%8B%E3%82%89aac%E5%BD%A2%E5%BC%8F%E3%81%B8%E5%A4%89%E6%8F%9B)
