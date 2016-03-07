import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';

// Import push state support so that we don't have React's ugly URLs
import { createHistory } from 'history';

/*
  Import Components
*/
import { NotFound } from './components/NotFound';
import { StorePicker } from './components/StorePicker';
import { App } from './components/App';

/*
  Routes
*/
const routes = (
  <Router history={createHistory()}>
    <Route path="/" component={StorePicker} />
    <Route path="/store/:storeId" component={App} />
    <Route path="*" component={NotFound} />
  </Router>
);

ReactDOM.render(routes, document.getElementById('main'));
