import type { RouteLocationNormalized } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';

export const routes = [
  { path: '/', component: Home },
  { path: '/about', name: "about", component: About },
  { path: '/login', component: () => import('remote-app2/LoginForm') },
  { path: '/register', component: () => import('remote-app2/RegisterForm') },
  { path: '/wichteln', name: "Wichteln", component: () => import('remote-wichteln/WichtelnGruppeErstellen'), props: (route: RouteLocationNormalized) => ({ grp: route.query.grp }) },
  { path: '/wichteln/profil', name: "Wichteln - Dein Profil", component: () => import('remote-wichteln/WichtelnProfilErstellen'), props: (route: RouteLocationNormalized) => ({ grp: route.query.grp }) },
  { path: '/wichteln/profil/:id', name: "Wichteln - Gruppe", component: () => import('remote-wichteln/WichtelnProfil'), props: true }
];


export default routes;
