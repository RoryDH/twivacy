import React, { Component } from 'react'
import { fire, base } from '../fire'
import firebase from 'firebase'
import rsa_crypto from '../rsa_crypto_utils'
import FriendList from './FriendList'

class Settings extends Component {

  componentDidMount() {
    // base.bindToState('messages', {
    //   context: this,
    //   state: 'messages',
    //   asArray: true
    // });
  }
  generateKeyPair = async () => {
    let keys = await rsa_crypto.generateExportedKeyPair()

    base.updateDoc(`twitter_users/${this.props.twitterUser.uid}`, {
      public_key: keys.public_key,
      private_key: keys.private_key
    })

  }
  render() {
    return (
      <div>
        <h1>Settings</h1>
        <pre>{this.props.twitterUser.public_key ? `public key: ${JSON.stringify(this.props.twitterUser.public_key)}` : "no keypair"}</pre>
        <button onClick={this.generateKeyPair}>Generate New Key Pair</button>
        <FriendList twitterUser={this.props.twitterUser} />
      </div>
    )
  }
}

export default Settings
