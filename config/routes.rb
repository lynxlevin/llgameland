Rails.application.routes.draw do
  devise_for :users
  resources :top, only: [:index]
  root to: "top#index"
end
