import React, { Component } from 'react'
import { fire, base } from '../fire'
import firebase from 'firebase'

class FriendList extends Component {
  constructor(props) {
    super(props);
    this.state = { users: [] }
  }
  componentDidMount() {
    base.bindCollection('twitter_users', {
      context: this,
      state: 'users',
      withRefs: true,
      withIds: true
    })
  }
  isInFriendList = (id) => this.props.twitterUser.friendIds && (this.props.twitterUser.friendIds.indexOf(id) !== -1)
  handleFriendshipToggle = (evt) => {
    let prevFriendIds = this.props.twitterUser.friendIds || []
    let idChecked = evt.target.name
    let newFriendIds = evt.target.checked ?
      [...prevFriendIds, idChecked] :
      prevFriendIds.filter(id => id !== idChecked)
    // if (evt.target.checked) {
    //   let newFriendIds = [...this.props.twitterUser.friendIds, idChecked]
    // } else {
    //   let newFriendIds = this.props.twitterUser.friendIds.filter(id => id !== idChecked)
    // }
    base.updateDoc(`twitter_users/${this.props.twitterUser.uid}`, { friendIds: Array.from(new Set(newFriendIds)) })
  }

  userList = () => {
    return <ul>
      {this.state.users.map((user, index) => {
        return (
          <li key={index}>
            <input
              name={user.uid}
              type="checkbox"
              checked={this.isInFriendList(user.uid)}
              onChange={this.handleFriendshipToggle} />
            {user.username}
          </li>
        )
      })}
    </ul>
  }

  render() {
    return (
      <div>
        <h2>Twivacy users who can decrypt my new tweets</h2>
        {this.userList()}
      </div>
    )
  }
}

export default FriendList;
