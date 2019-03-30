import React, { Component } from 'react';
import $ from "jquery";
// import { Link } from '../node_modules/react-router-dom';
import ReactModal from 'react-modal';
import Signup from './component_signup';
import Login from './component_login';
// import jwtDecode from 'jwt-decode';


ReactModal.setAppElement('#root');

export default class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showSignup: false,
      showLogin: false
    };
  }

  handleCloseModals = () => {
    this.setState({
      showSignup: false,
      showLogin: false
    });
  }

  handleSignup = () => {
    this.setState({
      showSignup: true
    })
  }

  handleLogin = () => {
    this.setState({
      showLogin: true
    })
  }

  componentDidMount() {
    $("body").css("background-image", "none")
  }

  startSession = () => {
// console.log("jwtDecode: ", jwtDecode(window.localStorage.getItem('jwt')));
// const user = jwtDecode(window.localStorage.getItem('jwt'));
// console.log("user: ", user);

    this.props.changeUser();
  }

  render() {
    return (
      <div >
        <div>
          {/* SignUp */}
          <ReactModal isOpen={this.state.showSignup} contentLabel="onRequestClose Example" onRequestClose={this.handleCloseModals}>
            <Signup closeModal={this.handleCloseModals} />
          </ReactModal>
        </div>

        <div>
          {/* SignLogin */}
          <ReactModal isOpen={this.state.showLogin} contentLabel="onRequestClose Example" onRequestClose={this.handleCloseModals}>
            <Login closeModal={this.handleCloseModals} startSession={this.startSession}/>
          </ReactModal>
        </div>

        <div className="splash">
          <div className="splash-login">
            {/* <Link to={'/'}><button type="button" className="btn btn-success" onClick={this.change_user} value={1}>Bob</button></Link>
            <Link to={'/'}><button type="button" className="btn btn-success" onClick={this.change_user} value={2}>Alice</button></Link> */}
            <button type="button" className="btn btn-success" onClick={this.handleLogin}>Login</button>

          </div>
          <div className="call-to-action">
            <h1>Take Stress Out of Your Trip</h1>
            <h1>Start Planning Today!</h1>
            <button type="button" className="btn btn-warning" onClick={this.handleSignup}>Create Account</button>
          </div>
        </div>

        <div className="benefits">
          <div><h4>Your Itinerary In One Place</h4><i className="fas fa-clipboard-list fa-6x"></i></div>
          <div><h4>Collaborate Together</h4><i className="fas fa-handshake fa-6x"></i></div>
          <div><h4>Recommendations</h4><i className="fas fa-theater-masks fa-6x"></i></div>
        </div>
        
      </div>
    )
  }
}