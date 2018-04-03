import React, { Component } from 'react';
import { fire, base } from './fire';
import firebase from 'firebase'
import firestore from 'firebase';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import Feed from './components/Feed';
import Settings from './components/Settings';
import PropsRoute from './components/PropsRoute';

const routes = [
  {
    path: "/",
    exact: true,
    main: Feed,
    link_name: "Feed"
  },
  {
    path: "/settings",
    main: Settings,
    link_name: "Settings"
  }
];
// const TwitterUserContext = React.createContext(null);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // firebase_user: null,
      twitterUser: null,
      loading: true
    }; // <- set up react state
  }
  componentWillMount(){

  }
  componentDidMount(){
    let component = this
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        let uid = user.providerData[0].uid;
        base.bindDoc(`twitter_users/${uid}`, {
          context: component,
          state: "twitterUser",
          then() {
            // component.formatUserStructure()
            component.setState({
              // firebase_user: user,
              loading: false
            })
          },
          onFailure(err) { }
        });
      } else {
        this.setState({loading: false})
      }
    });
  }
  login = () => {
    let provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result => {
      let user = result.user
      let username = result.additionalUserInfo.username
      let twitterUid = user.providerData[0].uid
      let token = result.credential.accessToken
      let secret = result.credential.secret

      // possibly set display name to username and index twitter_users by handle
      // user.updateProfile({ displayName: username })

      let update_attrs = {
        uid: twitterUid,
        username: username,
        accessToken: result.credential.accessToken,
        secret: result.credential.secret,
      }

      base.updateDoc(`twitter_users/${twitterUid}`, update_attrs).catch(e => {
        base.addToCollection(
          'twitter_users',
          {...update_attrs, friendIds: [twitterUid], },
          twitterUid
        )
      })
    })
  }
  logout = async () => {
    this.setState({loading: true})
    await firebase.auth().signOut()
    this.setState({loading: false})
  }
  render() {
    if (!crypto.subtle) {
      return <h2>Unsupported Browser: needs <a href="https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/">crypto.subtle</a></h2>
    }

    if (this.state.loading) {
      return <h2>Loading...</h2>
    }

    let user = firebase.auth().currentUser
    if (!user || !this.state.twitterUser) {
      return (
        <div>
          <h2>notloggedin</h2>
          <button onClick={this.login}>Login</button>
        </div>
      )
    }

    return (
      <Router>
        {/*<TwitterUserContext.Provider twitterUser={this.state.twitterUser}>*/}
        <div>
          <p>Signed in as {user.displayName}. <button onClick={this.logout}>Logout</button></p>
          <ul>
            {routes.map((route, index) => (
              <li key={index}><Link to={route.path}>{route.link_name}</Link></li>
            ))}
          </ul>
          <hr />
          <div>
            {routes.map((route, index) => (
              <PropsRoute
                key={index}
                path={route.path}
                exact={route.exact}
                // render={React.createElement(route.main, {twitterUser: this.state.twitterUser})}
                component={route.main}
                twitterUser={this.state.twitterUser}
              />
            ))}
          </div>
        </div>
        {/*</TwitterUserContext.Provider>*/}
      </Router>
    );

  }
}

export default App;
