class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.string :display_name, null: false, unique: true
      t.string :game_name,    null: false, unique: true
      t.text   :description
      t.string :image_url
      t.timestamps
    end
  end
end
