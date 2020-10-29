Rails.application.routes.draw do
  devise_for :users, :skip => [:passwords]
  resources :top, only: [:index]
  root to: "top#index"
  resources :games, only: [:new, :create, :show]
end
