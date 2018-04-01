import React, { Component } from 'react';
import { fire, base } from '../fire';
import firebase from 'firebase'

class Feed extends Component {
  componentDidMount(){
    // base.bindToState('messages', {
    //   context: this,
    //   state: 'messages',
    //   asArray: true
    // });
  }
  render() {
    return <h1>Feed</h1>
  }
}

export default Feed;
