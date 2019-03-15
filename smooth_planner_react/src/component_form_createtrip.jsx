import React, { Component } from 'react';

class CreateTrip extends Component {
  constructor(props) {
    super(props);
    // Declare State
    this.state = {
      name: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  // Change handlers to control form inputs
  onChangeTitle = (event)=>{
    this.setState({name: event.target.value})
  }
  
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.addTrip(this.state.name);
  }
  
  render() {
    return (
      <div className="create-form-container-small">
      <form onSubmit={this.handleSubmit} autocomplete="off">
        <div className="form-title">
          <h4 className="card-title">Create New Trip</h4>
        </div>
        <div className= "form-group row">
          <label htmlFor="name" className="form-label">Enter a name for your trip:</label>
          <input 
            type="text" 
            name="name" 
            className="form-control" 
            placeholder="Example: Trip to India, Weekend getaway in Victoria etc."
            onChange={this.onChangeTitle}
            value={this.state.name}
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

export default CreateTrip;
