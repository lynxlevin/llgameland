require 'rails_helper'

RSpec.describe "Games", type: :system do
  before do
    @user1 = FactoryBot.create(:user, admin: true)
    @game = FactoryBot.build(:game)
  end

  context 'ゲーム新規登録ができる時' do
    it 'userのadminがtrueであれば、ゲーム登録ページに遷移することができ、新規登録ができ、
        登録したゲームをクリックするとgame_nameのついたアドレスに遷移できること' do
      visit root_path
      binding.pry
      expect(page).to have_content('ログイン')
      click_on('ログイン')
      
      expect(current_path).to eq new_user_session_path
      fill_in 'Username', with: @user1.username
      fill_in 'Password', with: @user1.password
      click_on('Log in')

      expect(current_path).to eq root_path
      expect(page).to have_content('ゲーム登録')
      expect(page).to have_content('ゲーム画像')
      click_on('ゲーム登録')

      expect(current_path).to eq new_game_path
      fill_in 'Display name', with: @game.display_name
      fill_in 'Game name', with: @game.game_name
      fill_in 'Image url', with: @game.image_url
      fill_in 'Description', with: @game.description
      expect{ click_on('Submit') }.to change { Game.count }.by(1)
      
      expect(current_path).to eq root_path
      expect(page).to have_content(@game.display_name)
      expect(page).to have_content(@game.description)
      click_on(@game.display_name)

      expect(current_path).to eq show_game_path(@game.game_name)
    end
  end

  context 'ゲーム新規登録ができない時' do
    it 'userのadminがtrueでなければ、ゲーム登録ページに遷移できないこと' do
      @user2 = FactoryBot.create(:user)
      visit root_path
      expect(page).to have_content('ログイン')
      click_on('ログイン')
      
      expect(current_path).to eq new_user_session_path
      fill_in 'Username', with: @user2.username
      fill_in 'Password', with: @user2.password
      click_on('Log in')

      expect(current_path).to eq root_path
      expect(page).to have_no_content('ゲーム登録')
      expect(page).to have_no_content('ゲーム画像')
    end
  end

end
