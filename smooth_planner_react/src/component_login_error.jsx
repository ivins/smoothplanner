import React, { Component } from 'react';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null
    }

  }

  handlesSubmit = () => {
    this.props.closeModal();
  }

  render() {
    return(
      <div className="create-form-container">

        <form>
          <h1>Error</h1>
          <div className="form-group">
            <h3>Email or Password is incorrect.</h3>
            <h3 style={{color:'blue'}}>Please, try it again.</h3>
          </div>

          <div className="form-group row">
            <button type="submit" className="p btn btn-warning" onClick={this.handlesSubmit}>Ok</button>
          </div>
        </form>
    </div>
    )
  }
}

export default Login;
