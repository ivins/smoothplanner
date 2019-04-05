import React, { Component } from 'react';
import { Link } from '../node_modules/react-router-dom';
import CreateTrip from './component_form_createtrip';
import ReactModal from 'react-modal';
import axios from 'axios';

export default class TripsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModalNewTrip: false,
    }
  }
  handleOpenModalNewTrip = () => {this.setState({ showModalNewTrip: true });}
  handleCloseModalNewTrip = () => {this.setState({ showModalNewTrip: false});}

  addTrip = (tripName) => {
    axios.post('http://localhost:3001/api/v1/trips', {name: tripName, user_id: this.props.currentUser
  })
    .then(response => {
      window.location = `/trips/${response.data}`
    })
    .catch(function (error) {
      console.log(error);
    });
    
  }
  render() {
    function dateCheck(tripEnds) {
      const diff = Date.parse(tripEnds) - Date.now()
      if (diff) {
        return "list-group-item list-group-item-action list-group-item-success"
      } else {
        return "list-group-item list-group-item-action list-group-item-warning"
      }
    }
    const trips = this.props.trips.map((trip) => {
      return (<Link key={trip.id} to={'/trips/' + trip.id } className={dateCheck(trip.time_end)}>{trip.name}</Link>)
    })

    
    return (
      <div className="list-group trip-list">
        <button type="button" className="btn btn-outline-warning" onClick={this.handleOpenModalNewTrip} >+ New Trip</button>
          <ReactModal isOpen={this.state.showModalNewTrip} contentLabel="onRequestClose Example" onRequestClose={this.handleCloseModalNewTrip}>
            <CreateTrip  addTrip={this.addTrip} closeModal={this.handleCloseModalNewTrip}/>
          </ReactModal>
        <h4>Your Trips</h4>
        <ul>
          {trips}
        </ul>
      </div>
    )
  }
}
