# Ruby on Rails on Docker(-Compose) で手軽に開発環境構築

## 目的

色々インストールする手間を省いたり、開発者ごとに微妙に異なる環境の差異をなくすために `docker-compose` を使って一発で開発できるようにしたい！

## ディレクトリ構成

```
<Rails Directory>
  + docker
  | + Dockerfile
  | + docker-compose.yml
  | + mariadb_initdb.d
  |  + initialize.sql
  + (後は `rails new` で作成されたディレクトリ＆ファイルたち)
```

## Dockerfile

```dockerfile
FROM ruby:2.5.1-alpine

RUN apk update
RUN apk add --no-cache build-base libxml2-dev libxslt-dev tzdata mariadb-dev nodejs

WORKDIR "/var/rails"

RUN gem install bundler
# これを指定しておかないと nokogiri のインストールに失敗しちゃいます
RUN bundle config build.nokogiri --use-system-libraries
```

## docker-compose.yml

```yaml
version: "3"
services:
  rails:
    build:
      context: "."
      dockerfile: "./Dockerfile"
    command: >
      sh -c '
        rm -f tmp/pids/server.pid &&
        bundle install &&
        bundle exec rails server
      '
    ports:
    - "3000:3000"
    volumes:
    # ローカルのディレクトリをマウントすることで変更をすぐに反映させられます
    - "../:/var/rails"
    environment:
      DATABASE_HOST: "mariadb"
      RAILS_ENV: "development"
    depends_on:
    - "mariadb"

  mariadb:
    image: "mariadb:10.3.8"
    environment:
      MYSQL_ROOT_PASSWORD: "root_password"
    volumes:
    - "./mariadb_initdb.d:/docker-entrypoint-initdb.d" # 初期化のための SQL ファイルを配置するディレクトリ
```

## initialize.sql

`MYSQL_DATABASE` とかの環境変数を使う方法もありますが、開発用とテスト用の両方を作らないと何かと面倒なので、初期化用の SQL ファイルを実行してもらっています。

```sql
CREATE USER 'rails_server'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON rails_development.* TO 'rails_server'@'%';
GRANT ALL PRIVILEGES ON rails_test.* TO 'rails_server'@'%';
```

## 使い方

```bash
# 起動
docker-compose up -d

# 停止
docker-compose stop

# ログの確認
docker-compose logs -f

# Rails のコンテナに入る
docker-compose exec rails sh

# 初回起動後に以下のコマンドでデータベースを初期化する必要があります
> bundle exec rails db:create db:migrate
```

## まとめ

どこでもコマンド一発で起動できるので、とても便利！  
あと、チーム開発の場合でもバージョン固定とかが簡単なのでその点でも良いですね。  