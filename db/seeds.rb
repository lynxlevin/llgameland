# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Game.create(display_name: 'まるばつゲーム', game_name: 'tictactoe', description: '2人で遊べるまるばつゲームです。', image_url: 'http://localhost:3000/assets/1tictactoe-da852c751b2663aff87765085de3fd320a81395e13f044965e01a1218c99a556.png',)
Game.create(display_name: '15 Puzzle', game_name: '15puzzle', description: 'バラバラになった数字を、図のように順番に並べ替えてください。', image_url: 'http://localhost:3000/assets/215puzzle-3736d7dc552ff4897ccf29f392826e9e3468b8b0b01835f1ecc3ae8de8f0c7a1.png',)
Game.create(display_name: 'どんぐり探し', game_name: 'minesweeper', description: 'マインスイーパ風ゲーム
あなたの畑にリスがどんぐりを埋めてしまったようです。
優しいあなたは、どんぐりのあるところは避けて、畑を耕してください。', image_url: 'http://localhost:3000/assets/3minesweeper-ee38ced76ce37cdaf9f8c15b3cac024f4781b86aa85e1e84ddf441fe3a387f83.png',)