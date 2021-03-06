/*
  Add Fish Form
  <AddFishForm />
*/
import React from 'react';

// var AddFishForm = React.createClass({
class AddFishForm extends React.Component{
  createFish(event) {
    // Don't post/get
    event.preventDefault();

    // Get the values from form inputs
    var fish = {
      name: this.refs.name.value,
      price: this.refs.price.value,
      status: this.refs.status.value,
      desc: this.refs.desc.value,
      image: this.refs.image.value
    };

    // Add fish to app state
    this.props.addFish(fish);
    // clear the form
    this.refs.fishForm.reset();
  }

  render() {
    return (
      /* onSubmit of form triggers createFish function which in turn calls an App function to update state */
      <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
        <input type="text" ref="name" placeholder="Fish Name"/>
        <input type="text" ref="price" placeholder="Fish Price"/>
        <select ref="status">
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold out!</option>
        </select>
        <textarea type="text" ref="desc" placeholder="Desc"></textarea>
        <input type="text" ref="image" placeholder="URL to image"/>
        <button type="submit">+ Add item</button>
      </form>
    );
  }
}

export default AddFishForm;
