# deno 1.10 で導入された Web Storage API サポートを試したログ

こんな感じで使えた。手軽にストレージに残すことができるので便利そう！

```bash
$ deno repl --location https://example.com
Deno 1.10.1
exit using ctrl+d or close()
> localStorage.getItem('testkey')
null
> localStorage.setItem('testkey', 'foobar')
undefined
> localStorage.getItem('testkey')
"foobar"
> close()

$ deno repl --location https://example.com
Deno 1.10.1
exit using ctrl+d or close()
> localStorage.getItem('testkey')
"foobar"
```

Web と同じ制限もあるので、簡単なデータを残す用途に向いていそう。

> localStorage は最大 5 MB のデータを保存できて、プロセスを再起動してもデータは残り続けます。
> 一方、sessionStorage に保存したデータは、そのプロセスが終了するまでの間だけ生存し続けます。

[Deno 1.10.1 がリリースされたので新機能や変更点の紹介](https://zenn.dev/magurotuna/articles/deno-release-note-1-10-1)