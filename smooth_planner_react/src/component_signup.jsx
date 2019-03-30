import React, { Component } from 'react';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null
    }

  }

  handlesSubmit = (event)=>{
    event.preventDefault();
    this.props.addItem(this.state);
    this.props.closeModal();
  }

  render() {
    return(
      <div className="create-form-container">

        <form onSubmit={this.handlesSubmit} autoComplete="off">
          <h1>Create an account</h1>
          <div className="form-group">
            <label htmlFor="confirmation" className="form-label">Email:</label>
            <input 
              type="text" 
              className="form-control" 
              name="confirmation"
              onChange = {this.onChangeHandler}
              value = {this.state.confirmation}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="url" className="form-label">Password: </label>
            <input 
              name="password"
              type="password"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="url" className="form-label">Confirm the Password: </label>
            <input 
              name="password_confirm"
              type="password"
              className="form-control"
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

export default Signup;
