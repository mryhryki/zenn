# ImageMagick を使って LGTM 画像をターミナルで作成する

## モチベーション
LGTM 画像を作るサイトはあるけれど、著作権や肖像権とか気になるし、プライベートリポジトリで使うだけなので、自分の好きな画像で LGTM 画像を作りたかった！

## 使うもの
**ImageMagick** を使うので、インストールします。
**Mac** を使っているので **Homebrew** を使うと楽にインストールできます。

```bash
brew install imagemagick
```

## LGTM の元画像の取得

Google とかから適当に画像をダウンロードしてきます。

## 画像の変換

以下のようなコマンドで **ImageMagick** を使って **LGTM** の文字を左上に入れることができます。
ついでに、画像サイズが大きい場合は縦横比を保ったまま 480px * 480px 以下のサイズになるように変換しています。

```bash
INPUT_FILE="<元画像のファイルパスを入力>"
OUTPUT_FILE="<出力先のファイルパスを入力>"
convert \
    -resize "480x480>" \
    -pointsize "60" \
    -fill "#ff7700" \
    -gravity "NorthWest" \
    -annotate "0x0+0+0" \
    "LGTM" \
    "${INPUT_FILE}" \
    "${OUTPUT_FILE}"
```

すると、こんな感じの画像が生成されます 🎉 （フリー素材を使って作成してみました）
![example](/assets/images/blog/lgtm-script/example.jpg)

## あとがき

これで自分の好きな画像を心置きなく LGTM 画像に使うことができますね！

もちろん著作権や肖像権を侵害しないような使い方をしましょう。
