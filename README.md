# テーブル設計

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