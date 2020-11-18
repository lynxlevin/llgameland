require 'rails_helper'

RSpec.describe 'Games', type: :system do
  before do
    @user1 = FactoryBot.create(:user, admin: true)
    @game = FactoryBot.build(:game)
  end

  context 'ゲーム新規登録ができる時' do
    it 'userのadminがtrueであれば、ゲーム登録ページに遷移することができ、新規登録ができ、
        登録したゲームをクリックするとgame_nameのついたアドレスに遷移できること' do
      visit root_path
      expect(page).to have_content('ログイン')
      click_on('ログイン')

      expect(current_path).to eq new_user_session_path
      fill_in 'user_username', with: @user1.username
      fill_in 'user_password', with: @user1.password
      click_on('commit')

      expect(current_path).to eq root_path
      expect(page).to have_content('ゲーム登録')
      expect(page).to have_content('ゲーム画像')
      click_on('ゲーム登録')

      expect(current_path).to eq new_game_path
      fill_in 'Display name', with: @game.display_name
      fill_in 'Game name', with: @game.game_name
      fill_in 'Description', with: @game.description
      expect { click_on('Submit') }.to change { Game.count }.by(1)

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
      fill_in 'user_username', with: @user2.username
      fill_in 'user_password', with: @user2.password
      click_on('commit')

      expect(current_path).to eq root_path
      expect(page).to have_no_content('ゲーム登録')
      expect(page).to have_no_content('ゲーム画像')
    end
  end

  context '作成したゲームに必要な表示があり、不要な表示が隠れていること' do
    it 'まるばつゲームを遊べること' do
      @game1 = FactoryBot.create(:game_tictactoe)
      visit root_path
      expect(page).to have_content(@game1.display_name)
      expect(page).to have_content(@game1.description)
      click_on(@game1.display_name)

      expect(page).to have_content('RESTART')
      expect(page).to have_no_selector('#timer')
      expect(page).to have_no_content('EASY')
      expect(page).to have_no_content('MEDIUM')
      expect(page).to have_no_content('HARD')
      expect(page).to have_no_selector('#select1')
      expect(page).to have_no_selector('#select2')
      expect(page).to have_no_selector('#helper-btn')
      expect(page).to have_no_selector('#game-btn1')
      expect(page).to have_no_selector('#game-btn2')
      expect(page).to have_selector('#game-info-wrapper')
      expect(page).to have_no_selector('#clear-image')
      expect(page).to have_selector('#c00')
    end

    it '15puzzleを遊べること' do
      @game2 = FactoryBot.create(:game_15puzzle)
      visit root_path
      expect(page).to have_content(@game2.display_name)
      expect(page).to have_content(@game2.description)
      click_on(@game2.display_name)

      expect(page).to have_content('RESTART')
      expect(page).to have_selector('#timer')
      expect(page).to have_no_content('EASY')
      expect(page).to have_no_content('MEDIUM')
      expect(page).to have_no_content('HARD')
      expect(page).to have_selector('#select1')
      expect(page).to have_no_selector('#select2')
      expect(page).to have_no_selector('#helper-btn')
      expect(page).to have_no_selector('#game-btn1')
      expect(page).to have_no_selector('#game-btn2')
      expect(page).to have_selector('#game-info-wrapper')
      expect(page).to have_no_selector('#clear-image')
      expect(page).to have_selector('#tile1')
    end

    it 'どんぐり探しゲームを遊べること' do
      @game3 = FactoryBot.create(:game_minesweeper)
      visit root_path
      expect(page).to have_content(@game3.display_name)
      click_on(@game3.display_name)

      expect(page).to have_content('RESTART')
      expect(page).to have_selector('#timer')
      expect(page).to have_content('EASY')
      expect(page).to have_content('MEDIUM')
      expect(page).to have_content('HARD')
      expect(page).to have_selector('#select1')
      expect(page).to have_selector('#select2')
      expect(page).to have_selector('#helper-btn')
      expect(page).to have_selector('#game-btn1')
      expect(page).to have_selector('#game-btn2')
      expect(page).to have_selector('#game-info-wrapper')
      expect(page).to have_no_selector('#clear-image')
      expect(page).to have_selector('#tile0')

      click_on('RESTART')
      expect(page).to have_content('RESTART')
      expect(page).to have_selector('.tile-closed')
      expect(page).to have_no_selector('.tile-open')
      expect(page).to have_selector('#helper-btn')
      expect(page).to have_no_selector('#clear-image')
      expect(page).to have_selector('#tile0')

      click_on('はじめの第一歩')
      expect(page).to have_selector('.tile-open')
      expect(page).to have_no_selector('#helper-btn')

      click_on('RESTART')
      expect(page).to have_no_selector('.tile-open')
      expect(page).to have_selector('#helper-btn')
    end
  end
end
