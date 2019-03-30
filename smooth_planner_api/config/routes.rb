Rails.application.routes.draw do
  # get 'tokens/create'

  get 'items/index'

  get 'trips/index'

  get 'users/index'

  namespace :api do
    namespace :v1 do
      resources :users
      resources :items
      resources :trips
      resources :tokens, only: [:create]
    end
  end
end
