class ImagesController < ApplicationController
  def index
    redirect_to root_path unless user_signed_in? && current_user.id == 1
  end
end
