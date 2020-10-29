Rails.application.routes.draw do
  devise_for :users, :skip => [:passwords]
  root to: "games#index"
  resources :games, only: [:index, :new, :create, :show]
end
