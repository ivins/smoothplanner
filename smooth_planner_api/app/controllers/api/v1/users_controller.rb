module Api::V1
  class UsersController < ApplicationController
    def show
      @user = User.find(params[:id])
      @trip = @user.trips.order(:time_start)
      render json: @trip
    end

    def create
      byebug      
      input = User.new(params.permit(:email, :password))
      if (input.save)
        :ok
      else
        :bad_request
      end
    end
  end
end