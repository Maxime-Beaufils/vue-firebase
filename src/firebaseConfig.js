import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VUE_APP_apiKey,
  authDomain: 'vue-fb-c9c24.firebaseapp.com',
  databaseURL: 'https://vue-fb-c9c24.firebaseio.com',
  projectId: 'vue-fb-c9c24',
  storageBucket: 'vue-fb-c9c24.appspot.com',
  messagingSenderId: process.env.VUE_APP_messagingSenderId,
  appId: process.env.VUE_APP_appId,
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const currentUser = firebase.user;

// date issue fix according to firebase
const settings = {
  // timestampsInSnapshots: true,
};
db.settings(settings);

// firebase collections
const usersCollection = db.collection('users');
const postsCollection = db.collection('posts');
const commentsCollection = db.collection('comments');
const likesCollection = db.collection('likes');

export {
  db,
  auth,
  currentUser,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection,
};
