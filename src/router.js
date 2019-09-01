import Vue from 'vue';
import Router from 'vue-router';
import firebase from 'firebase';

import Login from '@/components/Login.vue';
import Dashboard from '@/components/Dashboard.vue';
import Settings from '@/components/Settings.vue';

Vue.use(Router);


const router = new Router({

  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(path => path.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser;

  if (requiresAuth && !currentUser) {
    next('/login');
  } else if (requiresAuth && currentUser) {
    next();
  } else {
    next();
  }
});

export default router;
