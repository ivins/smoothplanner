import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import ItemsContainerA from './component_items_container_A';
import ItemsContainerE from './component_items_container_E';
import ItemsContainerT from './component_items_container_T';
import ReactModal from 'react-modal';
import CreateTransport from './component_form_createTransport';
import CreateAccomodation from './component_form_create_A';
import CreateEvent from './component_form_create_E';
import RecomendationCard from './component_recomendation';


// this container will call the specific container (Accommodation, Event or Transportation)
// in order to mont the user's trip page

ReactModal.setAppElement('#root');
export default class ItemsContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      showModalT: false,
      showModalA: false,
      showModalE: false,
      current_trip: 0,
      showModalAEdit: false,
      showModalTEdit: false,
      showModalEEdit: false,
      itemToEdit: {},
      recommendationsVisible: false,
      itemIDForReccomendation: null,
    }
  }
  //  Modal state handling functions for a new Item
  // Transport modal
  handleOpenModalT = () => {this.setState({ showModalT: true });}
  handleCloseModalT = () => {this.setState({ showModalT: false });}
  // Accomodation modal
  handleOpenModalA = () => {this.setState({ showModalA: true });}
  handleCloseModalA = () => {this.setState({ showModalA: false });}
  // Event
  handleOpenModalE = (item) => {this.setState({ showModalE: true, itemToAdd: item});}
  handleCloseModalE = () => {this.setState({ showModalE: false });}

  //  Modal state handling functions for editing an item
  //  Accomodation modal
  handleOpenModalEdit = (type, item) => {
    if(type === 'T') {
      this.setState({ showModalTEdit: true, itemToEdit: item});
    } else if (type === 'A') {
      this.setState({ showModalAEdit: true, itemToEdit: item});
    } else if (type === 'E') {
      this.setState({ showModalEEdit: true, itemToEdit: item});
    }
  }

  handleCloseModalAEdit = () => {this.setState({ showModalAEdit: false});}
  handleCloseModalEEdit = () => {this.setState({ showModalEEdit: false});}
  handleCloseModalTEdit = () => {this.setState({ showModalTEdit: false});}


  areThereAnyRecommendations = () => {
    //  Reset to z
    this.setState({
      recommendationsVisible: false,
      itemIDForReccomendation: null,
    })
    this.state.cards.forEach((card) => {
      if(card.item_type === 'A') {
        this.setState({
          recommendationsVisible: true,
          itemIDForReccomendation: card.id,
        })
        return card.id;
      }
    })
  }

  fetchTripDetails() {
    axios.get(`http://localhost:3001/api/v1/trips/${this.props.match.params.id}.json`)
        .then(response => {
          this.setState({
            cards: response.data,
          });
      })
      .catch(error => {
        console.log(error)
      })
  }

 
  // calls delete trip method on App
  handle_deleteTrip = () => {
    const check = window.confirm(`Are you sure you want to delete this Trip?`);
    if (check === true)
      this.props.delete_trip(this.state.current_trip);
  }

 
  // delete method which connects to the database and runs destroy method on
  // items_controller to the specific item
  delete_item = (id) => {
    axios.delete(`http://localhost:3001/api/v1/items/${id}`)
    .then(response => {
      this.setState({cards: response.data})
    })
    .catch(error => console.log(error));
  }

  //  Adds a new item to the data base on form submitting
  addItem = (data) => {
    axios.post('http://localhost:3001/api/v1/items', data)
    .then(response => {
      this.setState({cards: response.data})
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  editItem = (item)=> {
    this.handleOpenModalEdit(item.item_type, item);
  }

  putItem =(data) => {
    axios.put(`http://localhost:3001/api/v1/items/${data.id}`, data)
      .then(response => {
        this.setState({cards: response.data});
        this.areThereAnyRecommendations();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // function to get the real trip's date
  // if the user commit some mistake, it will get the date based on the first and last events (cards)
  realDates = (tripInfo) => {
    if (this.state.cards.length > 0) {
      const firstDay = this.state.cards[0].time_start;
      const lastDay = this.state.cards[this.state.cards.length - 1].time_end;
      return(
        <div>
          <span>{moment.utc(firstDay).format('MMM Do')} - </span>
          <span>{moment.utc(lastDay).format('MMM Do YYYY')}</span>
        </div>
      )
    } else {
      return(
        <div>
          <span>{moment.utc(tripInfo.time_start).format('MMM Do')}  - </span>
          <span>{moment.utc(tripInfo.time_end).format('MMM Do YYYY')} </span>
        </div>
      )
    }
  }
  
  componentDidMount() {
    this.fetchTripDetails();
    this.areThereAnyRecommendations();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.fetchTripDetails();
    }
    if(prevState.cards.length !== this.state.cards.length) {
      this.areThereAnyRecommendations();
    }
  };

  render() {
    let allCards = this.state.cards.map((item) => {
      if (item.item_type === "A") {
        return <ItemsContainerA key={item.id} item={item} delete_item={this.delete_item} editItem={this.editItem}/>
      }
      else if (item.item_type === "E") {
        return <ItemsContainerE key={item.id} item={item} delete_item={this.delete_item} editItem={this.editItem}/>
      }
      else {
        return <ItemsContainerT key={item.id} item={item} delete_item={this.delete_item} editItem={this.editItem}/>
      }
    });

    if (this.props.trips.length > 0) {
      this.state.current_trip = this.props.trips.filter((trip) => (Number(trip.id) === Number(this.props.match.params.id)))[0]
    }
    const tripInfo = this.state.current_trip;


      return (
        <div className="items_container">
          <div className="trip_title">
            <h4>{ tripInfo ? tripInfo.name : null}</h4>
            <div>
              {this.realDates(tripInfo)}
            </div>
            <i className="fas fa-trash-alt" onClick={this.handle_deleteTrip}></i>
        </div>

        <div className="add_new_buttons">
          <div>
            {/* Transportation button */}
            <button onClick={this.handleOpenModalT} className="btn btn-outline-primary">+ Transportation</button>
            <ReactModal isOpen={this.state.showModalT} contentLabel="onRequestClose Example" onRequestClose={this.handleCloseModalT}>
              <CreateTransport addItem={this.addItem} closeModal={this.handleCloseModalT} tripID={this.props.match.params.id} />
            </ReactModal>
          </div>

          <div>
            {/* Accommodation Button */}
            <button onClick={this.handleOpenModalA} className="btn btn-outline-success">+ Accommodation</button>
            <ReactModal isOpen={this.state.showModalA} contentLabel="onRequestClose Example" onRequestClose={this.handleCloseModalA}>
              <CreateAccomodation addItem={this.addItem} closeModal={this.handleCloseModalA} tripID={this.props.match.params.id} />
            </ReactModal>
          </div>

          <div>
            {/* Event Button */}
            <button onClick={this.handleOpenModalE} className="btn btn-outline-info">+ Event</button>
            <ReactModal isOpen={this.state.showModalE} contentLabel="onRequestClose Example" onRequestClose={this.handleCloseModalE}>
              <CreateEvent addItem={this.addItem} closeModal={this.handleCloseModalE} tripID={this.props.match.params.id} item={this.state.itemToAdd}/>
            </ReactModal>
          </div>
        </div>

        {/* Edit Modals */}
        <ReactModal isOpen={this.state.showModalAEdit} contentLabel="onRequestClose Example" onRequestClose={this.handleCloseModalAEdit}>
          <CreateAccomodation closeModal={this.handleCloseModalAEdit} item={this.state.itemToEdit} addItem ={this.putItem}  />
        </ReactModal>

        <ReactModal isOpen={this.state.showModalTEdit} contentLabel="onRequestClose Example" onRequestClose={this.handleCloseModalTEdit}>
          <CreateTransport closeModal={this.handleCloseModalTEdit} item={this.state.itemToEdit} addItem ={this.putItem}  />
        </ReactModal>

        <ReactModal isOpen={this.state.showModalEEdit} contentLabel="onRequestClose Example" onRequestClose={this.handleCloseModalEEdit}>
          <CreateEvent closeModal={this.handleCloseModalEEdit} item={this.state.itemToEdit} addItem ={this.putItem}  />
        </ReactModal>
            
          <div className="cards_list">
            {allCards}
          </div>
            { (this.state.recommendationsVisible)? <RecomendationCard item_id={this.state.itemIDForReccomendation} openModalE={this.handleOpenModalE}/> : null }
      </div>
    )
  }
}



