/*
  Inventory
  <Inventory>
*/
import React from 'react';
import AddFishForm from './AddFishForm';

var Inventory = React.createClass({
  renderInventory: function(key) {
    var linkState = this.props.linkState;
    return (
      <div className="fish-edit" key={key}>
        <input type="text" valueLink={linkState('fishes.'+ key +'.name')}/>
        <input type="text" valueLink={linkState('fishes.'+ key +'.price')}/>
      <select valueLink={linkState('fishes.' + key + '.status')}>
          <option value="unavailable" readOnly>Sold!</option>
          <option value="available" readOnly>Fresh!</option>
        </select>
        <textarea valueLink={linkState('fishes.'+ key +'.desc')}/>
        <input type="text" valueLink={linkState('fishes.'+ key +'.image')}/>
      <button onClick={this.props.removeFish.bind(null, key)}>Remove!</button> {/* React magic will inject scope into null for .bind() */}
      </div>
    );
  },

  render: function() {
    return (
      <div>
        <h2>Inventory</h2>

        {/* Grab all the keys for fishes and over each call renderInventory */}
        {Object.keys(this.props.fishes).map(this.renderInventory)}

        {/* use a "spread" to pass down the props of Inventory which contains the addFish function from App -
          use with some caution! try to just pass what you need */}
        <AddFishForm {...this.props} />
        <button onClick={this.props.loadSamples}>Load sample fishes</button>
      </div>
    );
  },

  propTypes: {
    addFish: React.PropTypes.func.isRequired,
    loadSamples: React.PropTypes.func.isRequired,
    fishes: React.PropTypes.object.isRequired,
    linkState: React.PropTypes.func.isRequired,
    removeFish: React.PropTypes.func.isRequired
  }
});

export default Inventory;
