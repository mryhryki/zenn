# Rust非同期処理

[A final proposal for await syntax - language design - Rust Internals](https://internals.rust-lang.org/t/a-final-proposal-for-await-syntax/10021/16)

[Rustのasync/awaitの特徴4つ - Qiita](https://qiita.com/qnighy/items/05c38f73ef4b9e487ced)

[Rust: Futureのざっくりとした説明(0.3) - Qiita](https://qiita.com/OvQ/items/efb5e38b81d86521b9c8)

> 並列に実行したい場合は tokio::spawn や runtime::spawn などでタスクをspawnする必要があります。 (spawnの方法は使っているランタイムによって異なるので一概には言えません)