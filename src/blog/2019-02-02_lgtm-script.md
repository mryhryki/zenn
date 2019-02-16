<!--
title: ImageMagick を使って LGTM 画像をターミナルで作成する
keywords: ImageMagick,LGTM
update: 2019-02-02
-->

## モチベーション

LGTM 画像を作るサイトはあるけれど、著作権や肖像権とか気になるし、プライベートリポジトリで使うだけなので、自分の好きな <span style="color: #eee;">~~乃木坂46の~~</span> 画像で LGTM 画像を作りたかった！

## 使うもの

**ImageMagick** を使うので、インストールします。  

**Mac** を使っているので **Homebrew** を使うと楽にインストールできます。

```bash
brew install imagemagick
```

## LGTM の元画像の取得

Google とかから適当に画像をダウンロードしてきます。

## 画像の変換 

以下のようなコマンドで **ImageMagick** を使って `LGTM` の文字を左上に入れることができます。ついでに、画像サイズが大きい場合は縦横比を保ったまま 480px * 480px 以下のサイズになるように変換しています。

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
著作権や肖像権を侵害しないような使い方をしましょう。

## おまけ

新しい画像を追加するときや、LGTM をする度にどれにしようかとか、そういうの面倒なんで、スクリプト化しています。  
以下のコードを `lgtm` というファイル名でパスの通る場所に配置すれば可能になります。（Mac でしか動かない箇所があります）

```bash
#!/usr/bin/env bash

function usage(){
  cat << EOS

Usage
  lgtm <command>

Command
  <Empty> -> random
  random
  dir
  convert
  help

EOS
}

INPUT_DIR="${HOME}/.temp"
OUTPUT_DIR="${HOME}/.lgtm"

mkdir -p "${INPUT_DIR}"
mkdir -p "${OUTPUT_DIR}"

function convert_image(){
  local input="$1"
  local output="${OUTPUT_DIR}/$(uuidgen | tr '[:upper:]' '[:lower:]' | tr -d '\n').${input##*.}"

  convert \
      -resize "480x480>" \
      -pointsize "60" \
      -fill "#ff7700" \
      -gravity "NorthWest" \
      -annotate "0x0+0+0" \
      "LGTM" \
      "${input}" \
      "${output}" &&
    rm "${input}" &&
    echo "Convert: ${input} -> ${output}" ||
    echo "Failed : ${input}"
}


COMMAND="$1"; shift
test "${COMMAND}" == "" && COMMAND="random"

if [[ "${COMMAND}" == "random" ]]; then
  FILE_NUM="$(ls -F "${OUTPUT_DIR}" | grep -v / | wc -l)"
  LINE=$((${RANDOM} % ${FILE_NUM} + 1))
  FILE_PATH="${OUTPUT_DIR}/$(ls -1 "${OUTPUT_DIR}" | head -n "${LINE}" | tail -n 1)"
  echo "Copy: ${FILE_PATH}"
  osascript -e "set the clipboard to (read (POSIX file \"${FILE_PATH}\") as JPEG picture)"

elif [[ "${COMMAND}" == "dir" ]]; then
  open "${INPUT_DIR}"

elif [[ "${COMMAND}" == "convert" ]]; then
  find "${INPUT_DIR}" -name "*.jpg" |
    while read FILE; do
      convert_image "${FILE}"
    done

elif [[ "${COMMAND}" == "help" ]]; then
  usage
  exit 0

else
  usage
  exit 1
fi
```