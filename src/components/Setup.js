import React, { Component } from 'react'
import { fire, base } from '../fire'
import firebase from 'firebase'

class Setup extends Component {
  componentDidMount(){
    // base.bindToState('messages', {
    //   context: this,
    //   state: 'messages',
    //   asArray: true
    // });

  }
  generateKeyPair = async () => {
    let pair = await crypto.subtle.generateKey({
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: {name: "SHA-256"}
    }, false, ["encrypt", "decrypt"])
  }
  render() {
    return (
      <div>
        <h1>Setup</h1>
        <button>Generate Key Pair</button>
      </div>
    )
  }
}

export default Setup
