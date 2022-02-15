---
title: TypeScript: interface vs type
---

よく出てきそうな話題なのでメモ。

公式のドキュメントにあった。
https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces

![capture.png](https://i.gyazo.com/35a4c070926c6a31bf1d7477c836823a.png)


> Type aliases and interfaces are very similar, and in many cases you can choose between them freely.

ほとんど同じで、多くのケースでは自由に選んでいいよ、だってさ〜。


> If you would like a heuristic, use interface until you need to use features from type.

判断基準がほしいなら `type` の必要があるまで `interface` 使ってね、とのことなので私は `interface` を使っていこうと思います。
