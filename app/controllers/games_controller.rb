class GamesController < ApplicationController
  before_action :redirect_ileligible_user, except: :show

  def new
  end

  def create
  end
  
  def show
  end

  private

  def redirect_ileligible_user
    redirect_to root_path unless user_signed_in? && current_user.id == 1
  end
end
