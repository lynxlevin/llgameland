class GamesController < ApplicationController
  before_action :redirect_ileligible_user, only: [:new, :create, :edit, :update]
  before_action :find_game, only: [:edit, :update]

  def index
    @games = Game.all
  end

  def new
    @game = Game.new
  end

  def create
    @game = Game.new(game_params)
    if current_user.admin && @game.save
      redirect_to root_path
    else
      render :new
    end
  end

  def show
    @game = Game.where(game_name: params[:game_name])
    @nums1000 = create_array(1, 1000)
    @nums50 = create_array(1, 50)
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

  def about
  end

  private

  def redirect_ileligible_user
    redirect_to root_path unless user_signed_in? && current_user.admin
  end

  def game_params
    params.require(:game).permit(:image_url, :display_name, :game_name, :description)
  end

  def find_game
    @game = Game.find(params[:id])
  end

  def create_array(i, j)
    array = []
    (j - i + 1).times do |k|
      array << k + i
    end
    array
  end
end
