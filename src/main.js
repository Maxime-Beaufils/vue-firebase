import Vue from 'vue';
import VuejsDialog from 'vuejs-dialog';
import App from './App.vue';
import router from './router';
import store from './store';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';
import './assets/scss/app.scss';

const fb = require('./firebaseConfig.js');

Vue.config.productionTip = false;
Vue.use(VuejsDialog);

// handle page reloads
let app;
fb.auth.onAuthStateChanged((user) => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App),
    });
  }
});
