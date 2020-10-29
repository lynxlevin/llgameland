class GamesController < ApplicationController
  before_action :redirect_ileligible_user, except: :show

  def new
    @game = Game.new
  end

  def create
    @game = Game.new(game_params)
    if current_user.id == 1 && game.save
      redirect_to root_path
    else
      render :new
    end
  end
  
  def show
  end

  private

  def redirect_ileligible_user
    redirect_to root_path unless user_signed_in? && current_user.id == 1
  end

  def game_params
    params.require(:game).permit(:image, :name, :description)
  end
end
