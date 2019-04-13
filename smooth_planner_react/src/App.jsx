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
import jwtDecode from 'jwt-decode';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current_user: {
        name: null,
        id: null
      },
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
  

  //delete user's trip function
  delete_trip = (trip) => {
    axios.delete(`http://localhost:3001/api/v1/trips/${trip.id}`, {data: {user: this.state.current_user.id}} )
    .then(response => {
      window.location = "/";
      this.setState({trips: response.data});
    })
    .catch(error => console.log(error));
  }


  // function to ask the database for the user's trips
  populateTrips = (userId, userName) => {
    if (userId) {
      axios.get(`http://localhost:3001/api/v1/users/${userId}.json`)
      // .then(window.location = "/")
      .then(response => {
        // window.location.pathname = "/";
        this.setState({
            trips: response.data,
            current_user: {
              id: userId,
              name: userName,
            }
        });
        // window.location = "/";
        console.log("user: ", this.state.current_user, "trips: ", this.state.trips)
        console.log("path: ", window.location.pathname)
      })
      // .then(window.location = "/")
      // .then(window.location.reload)
      .catch(error => {
        console.log("error_populateTrips: ", error)
      })
    }
  }


  // sets the user based in their jwt
  changeUser = (userReceived) => {
    const user = jwtDecode(userReceived);
    // console.log("user: ", user)
    // this.setState({
    //     current_user: {
    //       name: user.email,
    //       id: user.id
    //     }
    // });
    this.populateTrips(user.id, user.email);
  }


  // componentDidUpdate() {
  //   console.log("componentDIDupdate")
  //   if (window.localStorage.getItem('jwt')) {
  //     const user = jwtDecode(window.localStorage.getItem('jwt'));
  //     if (user.id !== this.state.current_user.id) {
  //       this.changeUser(user);
  //     }
  //   }
  // }

  // shouldComponentUpdate() {
  //   console.log('SHOULDcomponentUpdate')
  // }

  // componentWillUpdate() {
  //   console.log("componenetWILLupdate")
  // }

  //logout function
  quit = () => {
    // window.localStorage.removeItem('jwt');
    this.setState({
      current_user: {
        name: null,
        id: null
      },
      trips: [],
      showModalShare: false
    });

    window.location = "/landing"
  }
  

  render() {
console.log("render")
console.log("trips: ", this.state.trips)
    // if (window.localStorage.getItem('jwt')) {
    //   const user = jwtDecode(window.localStorage.getItem('jwt'));
    //   if (user.id !== this.state.current_user.id) {
    //     this.changeUser(user);
    //   }
    // }

    if((window.location.pathname === "/landing") || (!this.state.current_user.id)) {
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
            <a href='/landing'><i className="fas fa-sign-out-alt fa-2x" title="Sign Out" onClick={this.quit}></i></a>
            </div>
          </nav> 
          <div className="side-bar">
            <TripsList trips={this.state.trips} currentUser = {this.state.current_user.id}/>
          </div>
        </header>
        <main>
          <Route path="/trips/:id" exact render={
                          (props)=>
                            <ItemsContainer {...props} trips={this.state.trips}
                                                       delete_trip={this.delete_trip}
                                                      //  populate_trips={this.populateTrips}
                                                      //  current_user={this.state.current_user.id}
                                                       />
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
