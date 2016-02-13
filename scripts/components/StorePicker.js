/*
  StorePicker
  This will make us a <StorePicker/>
*/
import React from 'react';
import { Navigation } from 'react-router';
import h from '../helpers';

var StorePicker = React.createClass({
  mixins: [Navigation],

  goToStore: function(event) {
    event.preventDefault();
    // get data from the input
    var storeId = this.refs.storeId.value;

    // send from <StorePicker/> to <App/>
    this.history.pushState(null, '/store/' + storeId);
  },

  render: function() {
    return (
      <form className="store-selector" onSubmit={this.goToStore}>
        {/* Commenting in JSX is ridiculous */}
        <h2>Please enter a store</h2>
        <input type="text" ref="storeId" defaultValue={h.getFunName()} required />
        <input type="Submit" />
      </form>
    );
  }
});

export default StorePicker;
