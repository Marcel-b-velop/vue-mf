import type { RouteLocationNormalized } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';

export const routes = [
  { path: '/', component: Home },
  { path: '/about', name: "about", component: About },
  { path: '/login', component: () => import('remote-app2/LoginForm') },
  { path: '/register', component: () => import('remote-app2/RegisterForm') },
  { path: '/wichteln', name: "wichteln", component: () => import('remote-wichteln/Wichteln'), props: (route: RouteLocationNormalized) => ({ grp: route.query.grp }) }
];


export default routes;
