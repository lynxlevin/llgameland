require 'rails_helper'

RSpec.describe Game, type: :model do
  before do
    @game = FactoryBot.build(:game)
  end

  describe 'ゲーム新規登録' do
    context '正常な動作の確認' do
      it 'display_nameとgame_nameが存在すれば登録できること' do
        expect(@game).to be_valid
      end

      it 'display_nameとgame_nameが存在すれば他の項目が空欄でも登録できること' do
        @game.description = ''
        @game.image_url = ''
        expect(@game).to be_valid
      end
    end

    context '登録できない時の確認' do
      it 'display_nameが空欄では登録ができないこと' do
        @game.display_name = nil
        @game.valid?
        expect(@game.errors.full_messages).to include("Display name can't be blank")
      end

      it 'display_nameが既に使用されているときは登録ができないこと' do
        @game.save
        another_game = FactoryBot.build(:game)
        another_game.display_name = @game.display_name
        another_game.valid?
        expect(another_game.errors.full_messages).to include('Display name has already been taken')
      end

      it 'game_nameが空欄では登録ができないこと' do
        @game.game_name = nil
        @game.valid?
        expect(@game.errors.full_messages).to include("Game name can't be blank")
      end

      it 'game_nameが既に使用されているときは登録ができないこと' do
        @game.save
        another_game = FactoryBot.build(:game)
        another_game.game_name = @game.game_name
        another_game.valid?
        expect(another_game.errors.full_messages).to include('Game name has already been taken')
      end
    end
  end
end
