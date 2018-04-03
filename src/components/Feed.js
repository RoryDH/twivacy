import React, { Component } from 'react'
import { fire, base } from '../fire'
import firebase from 'firebase'
import ComposeTweet from './ComposeTweet'
import EncryptedTweet from './EncryptedTweet'

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = { tweets: [] }
  }
  componentDidMount() {
    base.bindCollection('tweets', {
      context: this,
      state: 'tweets',
      withRefs: true,
      withIds: true,
      query: (ref) => ref.orderBy('createdAt', 'desc').limit(10)
    })
  }
  render() {
    return (
      <div>
        {this.props.twitterUser.public_key ? <ComposeTweet twitterUser={this.props.twitterUser} /> : <p>Generate a key pair in settings</p> }
        <div>
          {this.state.tweets.map(tweet => <EncryptedTweet key={tweet.id} tweet={tweet} twitterUser={this.props.twitterUser} />)}
        </div>
      </div>
    );
  }
}

export default Feed
