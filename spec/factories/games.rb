FactoryBot.define do
  factory :game do
    display_name { Faker::Game.title }
    game_name    { display_name.gsub(/\./, '') }
    description  { Faker::Lorem.paragraphs }
    image_url    { Faker::LoremPixel.image(size: '50x60') }
  end
  factory :game_tictactoe, class: Game do
    display_name { 'まるばつゲーム' }
    game_name    { 'tictactoe' }
    description  { '2人で遊べるまるばつゲームです。' }
    image_url    { '' }
  end
  factory :game_15puzzle, class: Game do
    display_name { '15 Puzzle' }
    game_name    { '15puzzle' }
    description  { 'バラバラになった数字を、図のように順番に並べ替えてください。' }
    image_url    { '' }
  end
  factory :game_minesweeper, class: Game do
    display_name { 'どんぐり探し' }
    game_name    { 'minesweeper' }
    description  { 'マインスイーパ風ゲーム
      あなたの畑にリスがどんぐりを埋めてしまったようです。
      優しいあなたは、どんぐりのあるところは避けて、畑を耕してください。' }
    image_url    { '' }
  end
end
