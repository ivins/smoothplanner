module Api::V1
  class ItemsController < ApplicationController

    def index
      @items = Item.all
      render json: @items
    end

    def destroy
      @item = Item.find(params[:id])
      @temp_trip = @item.trip_id

      if @item.destroy    
        @trip = Trip.find(@temp_trip)
        @items = @trip.items.order(:time_start)
        reorganizeTripDate  # updates the trip time_start
        render json: @items
      else
        render json: @item.errors, status: :unprocessable_entity
      end
    end

    def show
      location = Item.find_by({id: params[:id]}).geo_location
      reco_type = params[:suggestionType]
      query = params[:query]
      @recos = HTTP.get("https://maps.googleapis.com/maps/api/place/textsearch/json?", :params => {
        :query => query,
        :key => Rails.application.secrets.google_api_key,
        :radius => "10000",
        :location => location, 
        :type => reco_type,
        }).body
      render json: JSON.parse(@recos)
    end

    def create
      newitem = Item.new(item_params)
      if newitem.save
        @trip = Trip.find(newitem.trip_id)
        @items = @trip.items.order(:time_start)
        reorganizeTripDate  # updates the trip time_start
        render json: {items: @items, trip: @trip}
      end
      
    end

    def update
      item_to_update = Item.find(params[:id])
      item_to_update.update(item_params)
      if item_to_update.save
        @trip = Trip.find(item_to_update.trip_id)
        @items = @trip.items.order(:time_start)
        reorganizeTripDate  # updates the trip time_start and time_end
        render json: @items
      end
    end
    
    private

    # method to update trip.time_start according to the card(item) deletion
    def reorganizeTripDate
      @trip.update(time_start: @trip.items.order(:time_start).first.time_start) unless @items.empty?
      @trip.update(time_end: (@trip.items.order(:time_end).last.time_end ||
                                                  @trip.items.order(:time_start).last.time_start)) unless @items.empty?
    end
 
    
    def item_params
      params.require(:item).permit(
        :title, 
        :time_start, 
        :time_end, 
        :item_type,
        :details,
        :confirmation,
        :city_depart,
        :city_arrival,
        :venue,
        :address,
        :phone,
        :trip_id,
        :url,
        :geo_location,
      )
    end

  end
end
