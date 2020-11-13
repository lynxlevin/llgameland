FactoryBot.define do
  factory :game do
    display_name { Faker::Game.title }
    game_name    { display_name.gsub(/\./, "") }
    description  { Faker::Lorem.paragraphs }
    image_url    { Faker::LoremPixel.image(size: "50x60") }
  end
  factory :game_tictactoe, class: Game do
    display_name { 'まるばつゲーム' }
    game_name    { 'tictactoe' }
    description  { '2人で遊べるまるばつゲームです。' }
    image_url    { 'http://localhost:3000/assets/1tictactoe-da852c751b2663aff87765085de3fd320a81395e13f044965e01a1218c99a556.png' }
  end
  factory :game_15puzzle, class: Game do
    display_name { '15 Puzzle' }
    game_name    { '15puzzle' }
    description  { 'バラバラになった数字を、図のように順番に並べ替えてください。' }
    image_url    { 'http://localhost:3000/assets/215puzzle-3736d7dc552ff4897ccf29f392826e9e3468b8b0b01835f1ecc3ae8de8f0c7a1.png' }
  end
  factory :game_minesweeper, class: Game do
    display_name { 'どんぐり探し' }
    game_name    { 'minesweeper' }
    description  { 'マインスイーパ風ゲーム
      あなたの畑にリスがどんぐりを埋めてしまったようです。
      優しいあなたは、どんぐりのあるところは避けて、畑を耕してください。' }
    image_url    { 'http://localhost:3000/assets/3minesweeper-ee38ced76ce37cdaf9f8c15b3cac024f4781b86aa85e1e84ddf441fe3a387f83.png' }
  end
end
