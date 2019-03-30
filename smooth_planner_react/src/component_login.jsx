import React, { Component } from 'react';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null
    }

  }

  handlesSubmit = (event) => {
    event.preventDefault();
console.log("email: ", event.target.email.value);
console.log("password: ", event.target.password.value);
    // this.props.addItem(this.state);
    // this.props.closeModal();

    let loginData = new FormData();
    loginData.append("email", event.target.email.value);
    loginData.append("password", event.target.password.value);

    fetch("http://localhost:3001/api/v1/tokens",
    {method: 'POST', mode: 'cors', body: loginData})
    .then(res => res.json())
    .then(res => {
      // window.location = "/";
console.log("res.jwt: ", res.jwt);
      this.props.closeModal();
      window.localStorage.setItem('jwt', res.jwt);
      this.props.startSession();
    })
    // .then(() => window.location = '/')
    // .then(() => this.props.push('/'))
    .catch((error) => {
      console.log('There is an error: ', error.message);
      // this.props.history.push('/error')
    });

  }

  render() {
    return(
      <div className="create-form-container">

        <form onSubmit={this.handlesSubmit} autoComplete="off">
          <h1>Login</h1>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              name="email"
              type="text" 
              className="form-control"
              placeholder="Type your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="url" className="form-label">Password: </label>
            <input 
              name="password"
              type="password"
              className="form-control"
              placeholder="Type your password"
              required
            />
          </div>

          <div className="form-group row">
            <button type="submit" className="btn btn-primary">Submit</button>
            <button type="button" className="btn btn-danger" onClick={this.props.closeModal}>Cancel</button>
          </div>
        </form>
    </div>
    )
  }
}

export default Login;
