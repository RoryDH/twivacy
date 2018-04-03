import React, { Component } from 'react';
import { fire, base } from '../fire';
import firebase from 'firebase'
import '@firebase/functions'
import rsa_crypto from '../rsa_crypto_utils'
import aes_crypto from '../aes_crypto_utils'

import { debounce } from 'lodash';

class ComposeTweet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aesKey: null,
      tweetPlain: '',
      tweetEncrypted: '',
      consoleMessages: []
    }
  }

  log = (msg) => this.setState({ consoleMessages: [...this.state.consoleMessages, msg] })

  async componentDidMount() {
    this.log("Generating new AES key")
    let aesKey = await aes_crypto.generateKey()
    this.setState({ aesKey: aesKey })
    this.log(`=> ${aesKey}`)
  }
  _updateEncryptedTweet = async () => {
    this.log("Encrypting message")
    let cipher = await aes_crypto.encryptString(this.state.tweetPlain, this.state.aesKey)
    this.setState({
      tweetEncrypted: cipher
    })
    this.log(`=> ${cipher}`)
  }
  updateEncryptedTweet = debounce(this._updateEncryptedTweet, 500)
  handleTweetChange = (evt) => {
    this.setState({
      tweetPlain: evt.target.value,
      tweetEncrypted: null
    })
    this.updateEncryptedTweet()
  }

  sendTweet = async () => {
    this.setState({ tweetEncrypted: null, tweetPlain: '' })
    this.log("Sending tweet as ciphertext")
    var postTweet = firebase.functions().httpsCallable('postTweet')
    let tweetCipher = this.state.tweetEncrypted

    postTweet({ tweetCipher: tweetCipher }).then(async (result) => {
      let tweet = result.data
      this.log(`Tweet posted id: ${tweet.id_str}`)
      let decryption_keys_by_uid = {}

      for (let friendId of this.props.twitterUser.friendIds) {
        let friend = await base.get(`twitter_users/${friendId}`)
        if (!(friend.private_key && friend.public_key)) { return }
        this.log(`Wrapping AES key using @${friend.username} RSA public key`)
        let wrapped = await rsa_crypto.wrapKeyToString(this.state.aesKey, friend.public_key)
        decryption_keys_by_uid[friendId] = wrapped

        // let uw = await r.unwrapKeyFromString(wrapped, friend.private_key)
        // let dec = await a.decryptString(tweetCipher, uw)
        // console.log(dec)
      }

      this.log(`Saving keys...`)
      base.addToCollection("tweets", {
        uid: tweet.user.id_str,
        createdAt: (new Date(tweet.created_at)),
        cipherText: tweetCipher,
        decryption_keys_by_uid: decryption_keys_by_uid
      }, tweet.id_str).then((a) => {
        this.log(`=> Saved`)
        // debugger
      }).catch((e) => {
        this.log(`=> Error saving`)
      })

    }).catch((error) => {
      this.log(`=> Error sending tweet`)
      var code = error.code;
      var message = error.message;
      var details = error.details;
    });

    // let uw = await rsa_crypto.unwrapKey(wrap, this.props.twitterUser.private_key)
    // let dec = await aes_crypto.decryptString(tweetCipher, uw)
    // console.log(dec)

    // let r = rsa_crypto
    // let a = aes_crypto
    // debugger;
  }


  render() {
    return (
      <div>
        <h3>Compose an encrypted Tweet</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <input onChange={this.handleTweetChange}/>
          <button onClick={this.sendTweet} disabled={!this.state.tweetEncrypted}>Send</button>
        </form>
        <small>console</small>
        <pre>{this.state.consoleMessages.join("\n")}</pre>
      </div>
    )
  }
}

export default ComposeTweet;
