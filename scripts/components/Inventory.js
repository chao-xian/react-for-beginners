/*
  Inventory
  <Inventory>
*/
import React from 'react';
import AddFishForm from './AddFishForm';
import autobind from 'autobind-decorator';
import Firebase from 'firebase';
const ref = new Firebase('https://blazing-inferno-2155.firebaseio.com/')

@autobind
export class Inventory extends React.Component {

  constructor() {
    super();

    this.state = {
      uid: ''
    }
  }

  authenticate(provider) {
    console.log("Trying to authenticate with " + provider);
    ref.authWithOAuthPopup(provider, this.authHandler);
  }

  componentWillMount() {
    console.log("Check local storage if logged in");
    var token = localStorage.getItem('token');
    if(token) {
      ref.authWithCustomToken(token, this.authHandler);
    }
  }

  logout() {
    ref.unauth();
    localStorage.removeItem('token');
    this.setState({
      uid: null
    });
  }

  authHandler(err, authData) {
    if (err) {
      console.err(err);
      return;
    }

    // save login token into browser
    localStorage.setItem('token', authData.token);

    const storeRef = ref.child(this.props.params.storeId);
    storeRef.on('value', (snapshot)=>{
      var data = snapshot.val() || {};

      // claim store if no owner
      if (!data.owner) {
        storeRef.set({
          owner: authData.uid
        });
      }

      // update state to reflect current store and user
      this.setState({
        uid: authData.uid,
        owner: data.owner || authData.uid
      })
    });
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github" onClick={this.authenticate.bind(this, 'github')}>Log in with GitHub</button>
      </nav>
    )
  }

  renderInventory(key) {
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
  }

  render() {
    let logoutButton = <button onClick={this.logout}>Log out!</button>

    if (!this.state.uid) {
      return (
        <div>{ this.renderLogin() }</div>
      )
    }

    if (this.state.uid !== this.state.owner) {
      return(
        <div><p>Sorry you aren't the owner of this store</p></div>
      )
    }

    return (
      <div>
        <h2>Inventory</h2>
        { logoutButton }

        {/* Grab all the keys for fishes and over each call renderInventory */}
        {Object.keys(this.props.fishes).map(this.renderInventory)}

        {/* use a "spread" to pass down the props of Inventory which contains the addFish function from App -
          use with some caution! try to just pass what you need */}
        <AddFishForm {...this.props} />
        <button onClick={this.props.loadSamples}>Load sample fishes</button>
      </div>
    );
  }
}

Inventory.propTypes = {
  addFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
  fishes: React.PropTypes.object.isRequired,
  linkState: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired
}
