import Vue from 'vue';
import VueRouter from 'vue-router';
import Grid from '../views/Grid.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Grid',
    component: Grid,
  },
  {
    path: '/photo',
    name: 'Photo',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "photo" */ '../views/Photo.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
