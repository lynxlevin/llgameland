FactoryBot.define do
  factory :game do
    display_name { Faker::Game.title }
    game_name    { display_name }
    description  { Faker::Lorem.paragraphs }
    image_url    { Faker::LoremPixel.image(size: "50x60") }
  end
end
