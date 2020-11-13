# 「LynxLevin's Game Land」概要

数字を使ったパズルやマインスイーパなどのシンプルなゲームを  
ブラウザ上で気軽に楽しめます。

## URL
https://llgameland.herokuapp.com/

## テスト用アカウント
Username: test
Password: test

## 利用方法
遊びたいゲームをクリックし、プレイして下さい。  
遊び方がわからない時は、?マークをクリックすれば、遊び方が表示されます。

## 解決したい課題
昨今のコンピュータやシステムの進化により、ゲームはとても魅力的に、そして複雑にもなりました。  
その一方で、昔のシンプルなゲームに喜びを感じる方々も一定数いらっしゃいます。  
そんな方々がちょっとした時間に気軽に、ストレスなく遊んだり、  
秋の夜長にじっくり没頭したりできるような、  
そんなゲームを目指し、現代にも輝くシンプルゲームサイトを作っていきます。

## 要件定義

## 実装した機能と特徴
GIFつき

## 実装予定の機能


# データベース設計

## users テーブル
| Columns  | Type   | Options                       |
| -------- | ------ | ----------------------------- |
| username | string | null: false, uniqueness: true |
| email    | string |                               |
| password | string | null: false                   |

### Association
- has_many :game_scores
- has_many :favorite_games

## games テーブル
| Columns      | Type   | Options     |
| ------------ | ------ | ----------- |
| display_name | string | null: false |
| game_name    | string | null: false |
| description  | text   |             |
| image_url    | string |             |

### Association
- has_many :game_scores
- has_many :favorite_games

## game_scores テーブル
| Columns | Type       | Options                        |
| ------- | ---------- | ------------------------------ |
| user    | references | null: false, foreign_key: true |
| game    | references | null: false, foreign_key: true |
| score   | integer    | null: false                    |

### Association
- belongs_to :user
- belongs_to :game

## favorite_games テーブル
| Columns    | Type       | Options                        |
| ---------- | ---------- | ------------------------------ |
| user       | references | null: false, foreign_key: true |
| game       | references | null: false, foreign_key: true |
| eval_point | integer    | null: false                    |
| comment    | text       | null: false                    |

### Association
- belongs_to :user
- belongs_to :game

# ローカル環境での動作方法
ターミナルで以下の通りにコマンド入力してください。
s（Ruby on Railsのバージョン6.0.0でせい作成ています。）
1. 任意のディレクトリを開きます。
※「~/repositories」の部分は任意のディレクトリを指定します。
```
cd ~/repositories
```

2. リポジトリをクローンします。

```
git clone https://github.com/lynxlevin/llgameland.git
```
3. llgamelandディレクトリに移動します。

```
cd llgameland
```

4. Gemをインストールします。

```
bundle install
```

5. JavaScriptのパッケージをインストール

```
yarn install
```

6. データベースを生成します。

```
rails db:migrate
```

7. データベースにデータを登録します。

```
rails db:seed
```