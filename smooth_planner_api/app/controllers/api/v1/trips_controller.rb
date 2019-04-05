module Api::V1
  class TripsController < ApplicationController
    def index
    end

    def show
      @trip = Trip.find(params[:id])
      @items = @trip.items.order(:time_start)
      render json: {items: @items, trip: @trip}
    end

    def create
      @user = User.find(params[:user_id])
      newtrip = Trip.create(trip_params)
      newtrip.users << @user
      if newtrip.save 
        render json: newtrip.id
      else
        render json: "Error! Please try again"
      end
    end

    def destroy
      trip = Trip.find(params[:id])
      user = User.find(params[:user])
      trip.destroy
      trip = user.trips.order(:time_start)
      render json: trip
    end

    def update
      @trip = Trip.find(params[:id])
      @user = User.find_by(email: params[:email])
      @successful = [{ message: "User was successfully added" }]
      @unsuccessful = [{ message: "No user exists with that email so could not be added to this trip." }]
      if (@user && !(@trip.users.include?(@user)))
        @trip.users << @user
        render json: @successful
      else
        render json: @unsuccessful
      end
    end

    private
    def trip_params
      params.require(:trip).permit(:name)
    end
  end
end
