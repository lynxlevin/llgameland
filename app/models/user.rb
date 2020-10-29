class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, password_length: 4..128
  validates :username, presence: true, uniqueness: true

  def email_required?
    false
  end

  def email_changed?
    false
  end
end
