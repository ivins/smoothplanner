import React, { Component } from 'react';
import './styles/App.css';
import axios from 'axios';
import ItemsContainer from './component_items_container';
import TripsList from './component_trips_list'
import { BrowserRouter, Route, Link } from '../node_modules/react-router-dom'
import Share from './component_share';
import ReactModal from 'react-modal';
import Home from './component_home';
import Landing from './component_landing';
import image from "./styles/images/amazing-austria-dawn-1323550.jpg"
import $ from "jquery";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current_user: {name: "Alice", id: 2},
      trips: [],
      showModalShare: false
    }

    this.handleOpenModalShare = this.handleOpenModalShare.bind(this);
    this.handleCloseModalShare = this.handleCloseModalShare.bind(this);
  }

  // Share
  handleOpenModalShare() {
    this.setState({ showModalShare: true });
  }
  handleCloseModalShare () {
    this.setState({ showModalShare: false });
  }
  
  // function to ask the database for the user's trips
  populateTrips = (userId) => {
    axios.get(`http://localhost:3001/api/v1/users/${userId}.json`)
    .then(response => {
      this.setState({trips: response.data})
    })
    .catch(error => {
      console.log(error)
    })
  }

  delete_trip = (trip) => {
    axios.delete(`http://localhost:3001/api/v1/trips/${trip.id}`, {data: {user: this.state.current_user.id}} )
    .then(response => {
      window.location = "/"
      this.setState({trips: response.data});
    })
      .catch(error => console.log(error));
  }

  // Fake Auth function to change user btw Bob (1) and Alice(2)
  changeUser = (id) => {
    if (id === '1') {
      this.setState({
        current_user: {name: "Bob", id: 1}
      })
     } else {
      this.setState({
        current_user: {name: "Alice", id: 2}
      })
    }
    this.populateTrips(id);
  }

  componentDidMount() {   
    if (this.state.current_user) {
      this.populateTrips(this.state.current_user.id);
    }
  }
  
  render() {
    if(window.location.pathname === "/landing") {
      return (
            <BrowserRouter>
            <div className="landing">
              <Landing changeUser={this.changeUser}/>
            </div>
            </BrowserRouter>
          );
    } else {
      $("body").css("background-image", 'url(' + image + ')')

      return (
        <BrowserRouter>
        <div className="App">
        <header>
          <nav>
            <div className="logo">
              <Link to={'/'}><i className="fas fa-home fa-2x"></i></Link>
              <h2>Smooth Planner</h2>
            </div>
            <div className="print_share">
            <i onClick={this.handleOpenModalShare} className="fas fa-share-alt fa-2x" title="Share Trip With Another User"></i>
            <a href="javascript:window.print()"><i className="fas fa-print fa-2x" title="Print Preview"></i></a>
            <a href='/landing'><i className="fas fa-sign-out-alt fa-2x" title="Sign Out"></i></a>
            </div>
          </nav> 
          <div className="side-bar">
            <TripsList trips={this.state.trips} currentUser = {this.state.current_user.id}/>
          </div>
        </header>
        <main>
          <Route path="/trips/:id" exact render={
            (props)=> <ItemsContainer {...props} trips={this.state.trips} delete_trip={this.delete_trip} />
          }/>
          <Route path="/" exact render={()=> <Home user={this.state.current_user.name}/>}/>
        </main>

        <Route path="/trips/:id" render={(props)=>
        <div>
          <ReactModal 
            isOpen={this.state.showModalShare}
            contentLabel="onRequestClose Example"
            onRequestClose={this.handleCloseModalShare}
          >
            <Share closeModal={this.handleCloseModalShare} {...props}/>
          </ReactModal>
        </div> }/>
        </div>
        </BrowserRouter>
      );
    }
  }
}

export default App;
