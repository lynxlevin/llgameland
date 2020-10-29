require 'rails_helper'

RSpec.describe "Users", type: :system do
  before do
    @user = FactoryBot.build(:user)
  end

  context 'ユーザー新規登録ができるとき' do
    it '正しい情報を入力すればユーザー新規登録ができ、トップページに移動する' do
      visit root_path
      expect(page).to have_content('新規登録')
      click_on('新規登録')
      
      expect(current_path).to eq new_user_registration_path
      fill_in 'Username', with: @user.username
      fill_in 'Password', with: @user.password
      fill_in 'Password confirmation', with: @user.password_confirmation
      expect{ find('input[name=commit]').click }.to change { User.count }.by(1)
      
      expect(current_path).to eq root_path
      expect(page).to have_content('マイページ')
      expect(page).to have_content('ログアウト')
      expect(page).to have_content(@user.username)
      expect(page).to have_no_content('ログイン')
      expect(page).to have_no_content('新規登録')
    end
  end
  
  context 'ユーザー新規登録ができないとき' do
    it '何も入力しないとユーザー新規登録ができず、エラーメッセージが表示されること' do
      visit root_path
      expect(page).to have_content('新規登録')
      click_on('新規登録')
      
      expect(current_path).to eq new_user_registration_path
      expect{ find('input[name=commit]').click }.to change { User.count }.by(0)
      
      expect(current_path).to eq user_registration_path
      expect(page).to have_content("Username can't be blank")
      expect(page).to have_content("Password can't be blank")
    end
    
    it '既に使用されているUsernameだとユーザー新規登録ができず、エラーメッセージが表示されること' do  
      @user.save
      visit root_path
      expect(page).to have_content('新規登録')
      click_on('新規登録')
      
      expect(current_path).to eq new_user_registration_path
      fill_in 'Username', with: @user.username
      fill_in 'Password', with: @user.password
      fill_in 'Password confirmation', with: @user.password_confirmation
      expect{ find('input[name=commit]').click }.to change { User.count }.by(0)

      expect(current_path).to eq user_registration_path
      expect(page).to have_content('Username has already been taken')
    end

    it '何も入力しないとユーザー新規登録ができず、エラーメッセージが表示されること' do
      visit root_path
      expect(page).to have_content('新規登録')
      click_on('新規登録')
      
      expect(current_path).to eq new_user_registration_path
      fill_in 'Username', with: @user.username
      fill_in 'Password', with: @user.password
      fill_in 'Password confirmation', with: @user.password_confirmation + "a"
      expect{ find('input[name=commit]').click }.to change { User.count }.by(0)
      
      expect(current_path).to eq user_registration_path
      expect(page).to have_content("Password confirmation doesn't match Password")
    end
  end

  context 'ログインができるとき' do
    it '正しく入力すればログインができ、トップページに戻ること' do
      @user.save
      visit root_path
      expect(page).to have_content('ログイン')
      click_on('ログイン')
      
      expect(current_path).to eq new_user_session_path
      fill_in 'Username', with: @user.username
      fill_in 'Password', with: @user.password
      click_on('Log in')
      
      expect(current_path).to eq root_path
      expect(page).to have_content('マイページ')
      expect(page).to have_content('ログアウト')
      expect(page).to have_content(@user.username)
      expect(page).to have_no_content('ログイン')
      expect(page).to have_no_content('新規登録')
    end
  end
  
  context 'ログインができないとき' do
    it '何も入力しないとログインができず、エラーメッセージが表示されること' do
      @user.save
      visit root_path
      expect(page).to have_content('ログイン')
      click_on('ログイン')
      
      expect(current_path).to eq new_user_session_path
      click_on('Log in')

      expect(current_path).to eq user_session_path
      expect(page).to have_content('Invalid Username or password.')
    end
  end

  context 'ログアウトができるとき' do
    it 'ログイン状態ではログアウトができること' do
      @user.save
      visit root_path
      expect(page).to have_content('ログイン')
      expect(page).to have_no_content('ログアウト')
      click_on('ログイン')
      
      expect(current_path).to eq new_user_session_path
      fill_in 'Username', with: @user.username
      fill_in 'Password', with: @user.password
      click_on('Log in')
      
      expect(current_path).to eq root_path
      expect(page).to have_content(@user.username)
      expect(page).to have_content('マイページ')
      expect(page).to have_content('ログアウト')
      expect(page).to have_no_content('ログイン')
      expect(page).to have_no_content('新規登録')
      click_on('ログアウト')

      expect(current_path).to eq root_path
      expect(page).to have_no_content(@user.username)
      expect(page).to have_no_content('マイページ')
      expect(page).to have_no_content('ログアウト')
      expect(page).to have_content('ログイン')
      expect(page).to have_content('新規登録')
    end
  end

  context 'マイページでEdit Userができるとき' do
    it 'ログイン状態ではUsernameの変更ができること' do
      @user.save
      visit root_path
      expect(page).to have_no_content('マイページ')
      expect(page).to have_no_content('ログアウト')
      expect(page).to have_content('ログイン')
      expect(page).to have_content('新規登録')
      click_on('ログイン')
      
      expect(current_path).to eq new_user_session_path
      fill_in 'Username', with: @user.username
      fill_in 'Password', with: @user.password
      click_on('Log in')
      
      expect(current_path).to eq root_path
      expect(page).to have_content(@user.username)
      expect(page).to have_content('マイページ')
      expect(page).to have_content('ログアウト')
      expect(page).to have_no_content('ログイン')
      expect(page).to have_no_content('新規登録')
      click_on('マイページ')

      expect(current_path).to eq edit_user_registration_path
      fill_in'Username', with: @user.username + "a"
      fill_in'Current password', with: @user.password
      click_on('Update')

      expect(current_path).to eq root_path
      expect(page).to have_content(@user.username + "a")
      expect(page).to have_content('マイページ')
      expect(page).to have_content('ログアウト')
      expect(page).to have_no_content('ログイン')
      expect(page).to have_no_content('新規登録')
    end

    it 'ログイン状態ではPasswordの変更ができること' do
      @user.save
      visit root_path
      expect(page).to have_no_content('マイページ')
      expect(page).to have_no_content('ログアウト')
      expect(page).to have_content('ログイン')
      expect(page).to have_content('新規登録')
      click_on('ログイン')

      expect(current_path).to eq new_user_session_path
      fill_in 'Username', with: @user.username
      fill_in 'Password', with: @user.password
      click_on('Log in')
      
      expect(current_path).to eq root_path
      expect(page).to have_content(@user.username)
      expect(page).to have_content('マイページ')
      expect(page).to have_content('ログアウト')
      expect(page).to have_no_content('ログイン')
      expect(page).to have_no_content('新規登録')
      click_on('マイページ')

      expect(current_path).to eq edit_user_registration_path
      fill_in'Username', with: @user.username
      fill_in'Current password', with: @user.password
      fill_in'Password', with: "1111"
      fill_in'Password confirmation', with: "1111"
      click_on('Update')

      expect(current_path).to eq root_path
      expect(page).to have_content(@user.username)
      expect(page).to have_content('マイページ')
      expect(page).to have_content('ログアウト')
      expect(page).to have_no_content('ログイン')
      expect(page).to have_no_content('新規登録')
      click_on('ログアウト')
      
      expect(current_path).to eq root_path
      expect(page).to have_no_content('マイページ')
      expect(page).to have_no_content('ログアウト')
      expect(page).to have_content('ログイン')
      expect(page).to have_content('新規登録')
      click_on('ログイン')
      
      expect(current_path).to eq new_user_session_path
      fill_in 'Username', with: @user.username
      fill_in 'Password', with: @user.password
      click_on('Log in')

      expect(current_path).to eq user_session_path
      expect(page).to have_content('Invalid Username or password.')
    end
  end
  
  context 'マイページでEdit Userができないとき' do
    it '何も入力がなければ、Usernameが変更ができないこと' do
      @user.save
      visit root_path
      expect(page).to have_no_content('マイページ')
      expect(page).to have_no_content('ログアウト')
      expect(page).to have_content('ログイン')
      expect(page).to have_content('新規登録')
      click_on('ログイン')

      expect(current_path).to eq new_user_session_path
      fill_in 'Username', with: @user.username
      fill_in 'Password', with: @user.password
      click_on('Log in')
      
      expect(current_path).to eq root_path
      expect(page).to have_content(@user.username)
      expect(page).to have_content('マイページ')
      expect(page).to have_content('ログアウト')
      expect(page).to have_no_content('ログイン')
      expect(page).to have_no_content('新規登録')
      click_on('マイページ')

      expect(current_path).to eq edit_user_registration_path
      fill_in'Username', with: ""
      click_on('Update')

      expect(current_path).to eq user_registration_path
      expect(page).to have_content("Username can't be blank")
      expect(page).to have_content("Current password can't be blank")

      visit root_path
      expect(page).to have_content(@user.username)
    end

    it '既に使用されているUsenameには変更ができないこと' do
      @user.save
      another_user = FactoryBot.create(:user)
      visit root_path
      expect(page).to have_no_content('マイページ')
      expect(page).to have_no_content('ログアウト')
      expect(page).to have_content('ログイン')
      expect(page).to have_content('新規登録')
      click_on('ログイン')

      expect(current_path).to eq new_user_session_path
      fill_in 'Username', with: @user.username
      fill_in 'Password', with: @user.password
      click_on('Log in')
      
      expect(current_path).to eq root_path
      expect(page).to have_content(@user.username)
      expect(page).to have_content('マイページ')
      expect(page).to have_content('ログアウト')
      expect(page).to have_no_content('ログイン')
      expect(page).to have_no_content('新規登録')
      click_on('マイページ')

      expect(current_path).to eq edit_user_registration_path
      fill_in'Username', with: another_user.username
      click_on('Update')

      expect(current_path).to eq user_registration_path
      expect(page).to have_content('Username has already been taken')

      visit root_path
      expect(page).to have_content(@user.username)
    end

    it 'New PasswordとNew Password confirmationが異なると、変更ができないこと' do
      @user.save
      visit root_path
      expect(page).to have_no_content('マイページ')
      expect(page).to have_no_content('ログアウト')
      expect(page).to have_content('ログイン')
      expect(page).to have_content('新規登録')
      click_on('ログイン')

      expect(current_path).to eq new_user_session_path
      fill_in 'Username', with: @user.username
      fill_in 'Password', with: @user.password
      click_on('Log in')
      
      expect(current_path).to eq root_path
      expect(page).to have_content(@user.username)
      expect(page).to have_content('マイページ')
      expect(page).to have_content('ログアウト')
      expect(page).to have_no_content('ログイン')
      expect(page).to have_no_content('新規登録')
      click_on('マイページ')

      expect(current_path).to eq edit_user_registration_path
      fill_in 'Current password', with: @user.password
      fill_in 'Password', with: "1111"
      fill_in 'Password confirmation', with: "2222"
      click_on('Update')
      
      expect(current_path).to eq user_registration_path
      expect(page).to have_content("Password confirmation doesn't match Password")

      visit root_path
      expect(page).to have_content(@user.username)
    end
  end
end
