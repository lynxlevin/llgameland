class Game < ApplicationRecord
  with_options presence: true, uniqueness: { case_sensitive: true } do
    validates :display_name
    validates :game_name
  end 
end
