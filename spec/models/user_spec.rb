require 'rails_helper'

RSpec.describe User, type: :model do
  before do 
    @user = FactoryBot.build(:user)
  end

  describe 'ユーザー新規登録' do
    context '正常な動作の確認' do
      it 'usernameとemailとpasswordとpassword_confirmationが存在すれば登録できること' do
        expect(@user).to be_valid
      end

      it 'emailがなくても登録できること' do
        @user.email = nil
        expect(@user).to be_valid
      end
    end

    context '登録できない時の確認' do
      it 'usernameが空欄では登録ができないこと' do
        @user.username = nil
        @user.valid?
        expect(@user.errors.full_messages).to include("Username can't be blank")
      end

      it 'usernameが既に使用されているときは登録ができないこと' do
        @user.save
        another_user = FactoryBot.build(:user, username: @user.username)
        another_user.valid?
        expect(another_user.errors.full_messages).to include('Username has already been taken')
      end

      it 'passwordが空欄では登録ができないこと' do
        @user.password = nil
        @user.valid?
        expect(@user.errors.full_messages).to include("Password can't be blank")
      end

      it 'passwordとpassword_confirmationが一致しないと登録ができないこと' do
        @user.password_confirmation = @user.password + "1"
        @user.valid?
        expect(@user.errors.full_messages).to include("Password confirmation doesn't match Password")
      end
    end
  end
end
