/*
  App
*/

import React from 'react';
import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';
import { Header } from './Header';
import { Fish } from './Fish';
import { AddFishForm } from './AddFishForm';
import Order from './Order';
import { Inventory } from './Inventory';
// Firebase
import Rebase from 're-base';
var base = Rebase.createClass('https://blazing-inferno-2155.firebaseio.com/');

@autobind
export class App extends React.Component {

  // React init state
  constructor() {
    super();
    this.state = {
      fishes: {},
      order: {}
    }
  }

  // React event on App component startup
  componentDidMount() {
    // Pull out of Firebase back end for persistence for given store the fishes
    base.syncState(this.props.params.storeId + '/fishes', {
      context: this, // <App/>
      state: 'fishes'
    });

    // Restore Orders state from localStorage
    var localStorageRef = localStorage.getItem('order-' + this.props.params.storeId);
    if (localStorageRef) {
      this.setState({
        order: JSON.parse(localStorageRef)
      });
    }
  }

  // React event on App component update
  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
  }

  addToOrder(key) {
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({order: this.state.order});
  }

  removeFromOrder(key) {
    delete this.state.order[key];
    this.setState({
      order: this.state.order
    });
  }


  addFish(fish) {
    var timeStamp = (new Date()).getTime();

    // Update the state object
    this.state.fishes['fish-' + timeStamp] = fish;

    // set the state
    this.setState({fishes: this.state.fishes});
  }

  removeFish(key) {
    if (confirm("Are you sure you want to remove this fish?")) {
      this.state.fishes[key] = null;
      this.setState({
        fishes: this.state.fishes
      });
    }
  }

  loadSamples() {
    this.setState({
      fishes: require('../sample-fishes.js')
    });
  }

  renderFish(key) {
    return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />
  }

  render(){
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder} />
        <Inventory addFish={this.addFish} removeFish={this.removeFish} loadSamples={this.loadSamples} fishes={this.state.fishes} linkState={this.linkState.bind(this)} {...this.props} />
      </div>
    );
  }
}

reactMixin.onClass(App, Catalyst.LinkedStateMixin);
