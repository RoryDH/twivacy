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
import Setup from './components/Setup';

const routes = [
  {
    path: "/",
    exact: true,
    main: Feed,
    link_name: "Feed"
  },
  {
    path: "/setup",
    main: Setup,
    link_name: "Setup"
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loading: true
    }; // <- set up react state
  }
  componentWillMount(){

  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged(user => {
      this.setState({loading: false})
      // if (user) {
      //   this.setState({uid: user.uid});
      // } else {
      //   this.setState({uid: null});
      // }
    });

    // base.bindToState('messages', {
    //   context: this,
    //   state: 'messages',
    //   asArray: true
    // });
  }
  login = () => {
    let provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result => {
      let user = result.user;
      let username = result.additionalUserInfo.username;
      let twitter_uid = user.providerData[0].uid;
      let token = result.credential.accessToken;
      let secret = result.credential.secret;

      // possibly set display name to username and index twitter_users by handle
      // user.updateProfile({ displayName: username })

      base.addToCollection('twitter_users', {
        username: username,
        accessToken: result.credential.accessToken,
        secret: result.credential.secret,
      }, twitter_uid).then(() => {
      }).catch(err => {
      });
    });
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

    let user = firebase.auth().currentUser;
    if (!user) {
      return (
        <div>
          <h2>notloggedin</h2>
          <button onClick={this.login}>Login</button>
        </div>
      )
    }

    return (
      <Router>
        <div>
          <p>Signed in as {user.displayName}. <button onClick={this.logout}>Logout</button></p>
          <ul>
            {routes.map((route, index) => (
              <li key={index}><Link to={route.path}>{route.link_name}</Link></li>
            ))}
          </ul>
          <div>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={route.main}
              />
            ))}
          </div>
        </div>
      </Router>
    );
    // return (
    //   <form onSubmit={this.addMessage.bind(this)}>
    //     <input type="text" ref={ el => this.inputEl = el }/>
    //     <input type="submit"/>
    //     <ul>
    //       { /* Render the list of messages */
    //         this.state.messages.map( (message, id) => <li key={id}>{message}</li> )
    //       }
    //     </ul>
    //   </form>
    // );
  }
}

export default App;
