// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();

const Twit = require('twit');

const getTwitClient = (accessToken, secret) => {
  return new Twit({
    consumer_key:         'GWQS37lNquQFxoku0x6anDa4D',
    consumer_secret:      'CTDDTUVUIJC4EAVa0pnqoPaJCUIMy3gaY5BvHeu5gvGhzAIhCE',
    access_token:         accessToken,
    access_token_secret:  secret,
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  })
}

exports.postTweet = functions.https.onCall((data, context) => {

  const uid = context.auth.uid;

  // const accessToken = data.accessToken;
  // const secret = data.secret;
  const tweetCipher = data.tweetCipher;

  let tweetPromise = new Promise((resolve, reject) => {
    admin.auth().getUser(uid).then((userRecord) => {
      let twitterUid = userRecord.providerData[0].uid;
      console.log(twitterUid);
      return firestore.collection("twitter_users").doc(twitterUid).get().then((doc) => {
        let twitter_user = doc.data();
        console.log(twitter_user.username);
        const T = getTwitClient(twitter_user.accessToken, twitter_user.secret);
        return T.post('statuses/update', { status: tweetCipher }).then((response) => {
          // let tweetId = response.data.id;
          console.log(response.data);
          return resolve(response.data);
        }).catch((e) => reject(e) );
      }).catch((e) => reject(e) );
    }).catch((e) => reject(e) );
  });

  return tweetPromise;

});

