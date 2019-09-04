import Vue from 'vue';
import Vuex from 'vuex';

const fb = require('./firebaseConfig.js');

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {},
    posts: [],
    hiddenPosts: [],
  },
  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val;
    },
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    setPosts(state, val) {
      if (val) {
        state.posts = val;
      } else {
        state.posts = [];
      }
    },
    setHiddenPosts(state, val) {
      if (val) {
        // make sure not to add duplicates
        if (!state.hiddenPosts.some(x => x.id === val.id)) {
          state.hiddenPosts.unshift(val);
        }
      } else {
        state.hiddenPosts = [];
      }
    }
  },
  actions: {
    clearData({
      commit,
    }) {
      commit('setCurrentUser', null);
      commit('setUserProfile', {});
      commit('setPosts', null);
    },
    fetchUserProfile({
      commit,
      state,
    }) {
      fb.usersCollection.doc(state.currentUser.uid).get().then((res) => {
        commit('setUserProfile', res.data());
      }).catch((err) => {
        console.log(err);
      });
    },
  },
});

// handle page reload
fb.auth.onAuthStateChanged((user) => {
  if (user) {
    store.commit('setCurrentUser', user);
    store.dispatch('fetchUserProfile');

    // realtime updates from our posts collection
    fb.postsCollection.orderBy('createdOn', 'desc').onSnapshot((querySnapshot) => {
      // check if created by currentUser
      let createdByCurrentUser;
      if (querySnapshot.docs.length) {
        createdByCurrentUser = store.state.currentUser.uid === querySnapshot.docChanges()[0]
          .doc.data().userId;
      }

      // add new posts to hiddenPosts array after initial load
      if (querySnapshot.docChanges().length !== querySnapshot.docs.length &&
        querySnapshot.docChanges()[0].type === 'added' && !createdByCurrentUser) {
        const post = querySnapshot.docChanges()[0].doc.data();
        post.id = querySnapshot.docChanges()[0].doc.id;

        store.commit('setHiddenPosts', post);
      } else {
        const postsArray = [];

        querySnapshot.forEach((doc) => {
          const post = doc.data();
          post.id = doc.id;
          postsArray.push(post);
        });

        store.commit('setPosts', postsArray);
      }
    });
  }
});

export default store;
