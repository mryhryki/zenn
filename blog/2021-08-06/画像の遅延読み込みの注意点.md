# 画像の遅延読み込みの注意点

[Googleデベロッパーが解説、Webページに画像の遅延読み込みを使いすぎるとパフォーマンスに悪影響を与える | コリス](https://coliss.com/articles/build-websites/operation/work/performance-effects-of-too-much-lazy-loading.html)

- 読み込みバイト数の削減には貢献しているが、LCP (Largest Contentful Paint) には悪影響を与える
- 初期表示のビューポート内にある画像にまで `loading="lazy"` をつけると画像の読み込みが遅くなる
