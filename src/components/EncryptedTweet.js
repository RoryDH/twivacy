import React, { Component } from 'react';
import { fire, base } from '../fire';
import firebase from 'firebase'
import rsa_crypto from '../rsa_crypto_utils'
import aes_crypto from '../aes_crypto_utils'
import { Tweet } from 'react-twitter-widgets'

class EncryptedTweet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      decryptedText: null,
      decryptionKey: this.props.tweet.decryption_keys_by_uid[this.props.twitterUser.uid]
    }
  }
  decryptionInfo = () => {
    if (!this.props.twitterUser.private_key) {
      return <div>You don't have a private key.</div>
    } else if (this.state.decryptionKey) {
      return <div>You have a key! <button onClick={this.decryptText}>Decrypt</button></div>
    } else {
      return <div>Cannot be decrypted.</div>
    }
  }
  decryptText = async () => {
    let unwrappedAesKey = await rsa_crypto.unwrapKeyFromString(this.state.decryptionKey, this.props.twitterUser.private_key)
    let text = await aes_crypto.decryptString(this.props.tweet.cipherText, unwrappedAesKey)
    this.setState({ decryptedText: text })
  }

  render() {
    return (
      <div>
        <hr />
        {this.state.decryptedText ? <strong>{this.state.decryptedText}</strong> : this.decryptionInfo()}
        <Tweet tweetId={this.props.tweet.id} />
      </div>
    )
  }
}

export default EncryptedTweet
