import Rebase from 're-base';
import firebase from '@firebase/app';
import '@firebase/firestore'

let fire = firebase.initializeApp({
  apiKey: "AIzaSyBBA8lUoKhS00Wkn0uzVbVEd37P0LASA8E",
  authDomain: "twivacy-3a746.firebaseapp.com",
  // databaseURL: "https://twivacy-3a746.firebaseio.com",
  projectId: "twivacy-3a746",
  // storageBucket: "twivacy-3a746.appspot.com",
  // messagingSenderId: "192114107460"
});
let db = firebase.firestore();
let base = Rebase.createClass(db);

export {
  fire,
  base
};
