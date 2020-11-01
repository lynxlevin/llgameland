Rails.application.routes.draw do
  devise_for :users, :skip => [:passwords]
  root to: "games#index"
  resources :games, only: [:index, :new, :create, :edit, :update]
  get ":game_name", to: "games#show", as: :show_game
  resources :images, only: :index
end
