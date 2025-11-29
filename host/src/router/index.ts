import Home from '../views/Home.vue';
import About from '../views/About.vue';

export const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/login', component: () => import('remote-app2/LoginForm') },
  { path: '/register', component: () => import('remote-app2/RegisterForm') }
];


export default routes;
