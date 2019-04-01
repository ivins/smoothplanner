import React, { Component } from 'react';
import $ from "jquery";
import ReactModal from 'react-modal';
import Signup from './component_signup';
import Login from './component_login';
import SigninError from './component_login_error';


ReactModal.setAppElement('#root');

export default class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showSignup: false,
      showLogin: false,
      showSigninError: false
    };
  }


  handleCloseModals = () => {
    this.setState({
      showSignup: false,
      showLogin: false,
      showSigninError: false
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


  handleLoginError = () => {
    this.setState({
      showSigninError: true
    })
  }


  componentDidMount() {
    $("body").css("background-image", "none")
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
          {/* Login */}
          <ReactModal isOpen={this.state.showLogin} contentLabel="onRequestClose Example" onRequestClose={this.handleCloseModals}>
            <Login closeModal={this.handleCloseModals} loginError={this.handleLoginError}/>
          </ReactModal>
        </div>

        <div>
          {/* Signin Error */}
          <ReactModal isOpen={this.state.showSigninError} contentLabel="onRequestClose Example"
            onRequestClose={this.handleCloseModals}>
            <SigninError closeModal={this.handleCloseModals} />
          </ReactModal>
        </div>

        <div className="splash">
          <div className="splash-login">
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