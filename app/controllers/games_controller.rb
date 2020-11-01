class GamesController < ApplicationController
  before_action :redirect_ileligible_user,  only: [:new, :create, :edit, :update]
  before_action :find_game, only: [:edit, :update]

  def index
    @games = Game.all
  end

  def new
    @game = Game.new
  end

  def create
    @game = Game.new(game_params)
    if current_user.id == 1 && @game.save
      redirect_to root_path
    else
      render :new
    end
  end
  
  def show
    @game = Game.where(game_name: params[:game_name])
  end

  def edit
  end

  def update
    if @game.update(game_params)
      redirect_to root_path
    else
      render :edit
    end
  end

  private

  def redirect_ileligible_user
    redirect_to root_path unless user_signed_in? && current_user.id == 1
  end

  def game_params
    params.require(:game).permit(:image_url, :display_name, :game_name, :description)
  end

  def find_game
    @game = Game.find(params[:id])
  end
end
