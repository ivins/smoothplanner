import React, { Component } from 'react';
import moment from 'moment'

// this is the specific container for ACCOMMODATION card type
export default class ItemsContainer extends Component {

  // calls delete item method on items_container
  handle_deleteItem = () => {
    const check = window.confirm(`Are you sure you want to delete this item?`);
    if (check === true)
      this.props.delete_item(this.props.item.id);
  }

  //function to format the date's presentation for accommodation
  presentDate = () => {
    if (this.props.item.time_end != null)
      return(
        <div className="timestamp">
          <span> <b>Dates: </b> {moment(this.props.item.time_start).format('dddd, MMMM Do YYYY')} </span>
          <span> <b> - </b> {moment(this.props.item.time_end).format('dddd, MMM Do YYYY')}</span>
        </div>
      )
    else {
      return(
        <div className="timestamp">
          <span> <b>First Day: </b> {moment.utc(this.props.item.time_start).format('dddd, MMMM Do YYYY')} - no last day yet.</span>
        </div>
      )
    }
  }

  render() {

    const item = this.props.item;
    const details = <span> <b>Details: </b>{item.details}<br /></span>
    const address = <span> <b>Address:</b> {item.address}<br /></span> 
    const phone = <span> <b>Phone:</b>{item.phone}<br /></span>
    const confirmation = <span> <b>Confirmation #: </b> {item.confirmation}<br /></span>
    
    return (
          //there are 3 divs: parent, main and hiden (which expands and collapses according user's click)
          <div className="card card-a">
            <div className="card-header" >
              <h4 className="item-card-head">{item.title || item.venue}</h4>
              <div className="item-card-head">
                <i className="fas fa-trash-alt" onClick={this.handle_deleteItem}></i>
                <i className="far fa-edit" onClick={()=>{this.props.editItem(item)}}></i>
              </div>
            </div>
            
            <div className="card-body card-body-upper">
              {this.presentDate()}
              <span><b>Venue: </b> <a href={item.url} target="_blank" rel="noopener noreferrer">{item.venue}</a></span>
            </div>
              
            <div className="card-body card-body-lower">
              { item.confirmation? confirmation : null }
              { item.phone? phone : null }
              { item.address? address : null }
              {item.details ? details : null}
            </div>
          </div>
    )
  }
}
