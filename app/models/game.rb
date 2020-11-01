class Game < ApplicationRecord
  validates :display_name, presence: true
  validates :game_name,    presence: true
end
