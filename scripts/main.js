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

var Catalyst = require('react-catalyst');

/*
  Import Components
*/
import NotFound from './components/NotFound';
import StorePicker from './components/StorePicker';
import App from './components/App';

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
