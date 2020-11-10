Rails.application.routes.draw do
  devise_for :users, :skip => [:passwords]
  root to: "games#index"
  resources :games, only: [:index, :new, :create, :edit, :update]
  get "games/:game_name", to: "games#show", as: :show_game
  get "about", to: "games#about", as: :about
  resources :images, only: :index
end
