var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var History = ReactRouter.History;

// Import push state support so that we don't have React's ugly URLs
var createBrowserHistory = require('history/lib/createBrowserHistory');

// Import helper utility
var h = require('./helpers');

// Firebase
var Rebase = require('re-base');
var base = Rebase.createClass('https://blazing-inferno-2155.firebaseio.com/');

/*
  App
*/
var App = React.createClass({
  getInitialState: function() {
    return {
      fishes: {},
      order: {}
    };
  },

  componentDidMount: function() {
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
  },

  componentWillUpdate: function(nextProps, nextState) {
    localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
  },

  addToOrder: function(key) {
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({order: this.state.order});
  },

  addFish : function(fish) {
    var timeStamp = (new Date()).getTime();

    // Update the state object
    this.state.fishes['fish-' + timeStamp] = fish;

    // set the state
    this.setState({fishes: this.state.fishes});
  },

  loadSamples: function() {
    this.setState({
      fishes: require('./sample-fishes.js')
    });
  },

  renderFish: function(key) {
    return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />
  },

  render: function(){
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order fishes={this.state.fishes} order={this.state.order} />
        <Inventory addFish={this.addFish} loadSamples={this.loadSamples} />
      </div>
    );
  }
});

/*
  Fish
  <Fish />
*/
var Fish = React.createClass({
  onButtonClick: function() {
    console.log('Going to add fish: ', this.props.index);
    var key = this.props.index;
    this.props.addToOrder(key);
  },

  render: function() {
    var details = this.props.details;
    var isAvailable = (details.status === 'available' ? true : false);
    var buttonText = (isAvailable ? 'Add to order' : 'Sold out!');
    return (
      <li className="menu-fish">
        <img src={details.image} alt={details.name} />
        <h3 className="fish-name">
          {details.name}
          <span className="price">{h.formatPrice(details.price)}</span>
        </h3>
        <p>{details.desc}</p>
        <button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
      </li>
    );
  }
});

/*
  Add Fish Form
  <AddFishForm />
*/
var AddFishForm = React.createClass({
  createFish: function(event) {
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
  },

  render: function() {
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
});

/*
  Header
  <Header>
*/
var Header = React.createClass({
  render: function() {
    return (
      <header className="top">
        <h1>Catch
          <span className="ofThe">
            <span className="of">of</span>
            <span className="the">the</span>
          </span>
          Day</h1>
        <h3 className="tagline">
          <span>{this.props.tagline}</span>
        </h3>
      </header>
    );
  }
});

/*
  Order
  <Order>
*/
var Order = React.createClass({
  renderOrder: function(key) {
    var fish = this.props.fishes[key];
    var count = this.props.order[key];

    if (!fish) {
      return <li key={key}>Sorry, fish no longer available</li>
    }

    return (
      <li key={key}>
        <span>{count}</span>lbs
          {fish.name}
          <span className="price">{h.formatPrice(count * fish.price)}</span>
      </li>
    );
  },

  render: function() {
    var orderIds = Object.keys(this.props.order);
    var total = orderIds.reduce((prevTotal, key)=> {
      var fish = this.props.fishes[key];
      var count = this.props.order[key];
      var isAvailable = this.props.order[key];

      if (fish && isAvailable) {
        return prevTotal + (count * parseInt(fish.price) || 0);
      }

      return prevTotal;
    }, 0);
    return (
      <div className="order-wrap">
        <h2 className="order-title">Your order</h2>
        <ul className="order">
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {h.formatPrice(total)}
          </li>
        </ul>
      </div>
    );
  }
});

/*
  Inventory
  <Inventory>
*/
var Inventory = React.createClass({
  render: function() {
    return (
      <div>
        <h2>Inventory</h2>
        {/* use a "spread" to pass down the props of Inventory which contains the addFish function from App -
          use with some caution! try to just pass what you need */}
        <AddFishForm {...this.props} />
        <button onClick={this.props.loadSamples}>Load sample fishes</button>
      </div>
    );
  }
});

/*
  StorePicker
  This will make us a <StorePicker/>
*/
var StorePicker = React.createClass({
  mixins: [History],

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

/*
  Not Found
*/
var NotFound = React.createClass({
  render: function() {
    return (
      <h1>Not found!</h1>
    );
  }
});

/*
  Routes
*/
var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={StorePicker} />
    <Route path="/store/:storeId" component={App} />
    <Route path="*" component={NotFound} />
  </Router>
);

ReactDOM.render(routes, document.getElementById('main'));
