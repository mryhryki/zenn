---
title: Instagramに使用されているCSSのテクニック を読んだ感想
created_at: 2021-05-04T10:00:00+09:00
---

[Web制作者は要チェック！Instagramに使用されているCSSのテクニック | コリス](https://coliss.com/articles/build-websites/operation/css/css-techniques-used-for-instagram.html) を読んだ感想。

> このレイアウトにはCSS GridやFlexboxを使用せず、CSSの絶対配置で実装されています。

> 72pxや335pxのような「固定幅」の値を見ると驚かれるかもしれませんが、何百万人ものユーザーが利用するサイトではそういうものなのです。

多くの人が見られるWebページだと、こういう思想になるのはわかる気がします。
CSS GridやFlexboxのように自動でやるのではなく、コントロール可能な記述で配置していく方が変なバグや想定外の挙動が起きにくいからかな、と思います。

生産性の観点では良くはないですが、最終的にかけるコストに見合う成果があるなら、こういうアプローチもありかな、と思いました。