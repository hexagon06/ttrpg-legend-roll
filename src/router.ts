import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';
import Home from './views/Home.vue';
import Messages from './views/Messages.vue';
import Room from './components/room/Room.vue';
import { auth } from './api';

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home, name: 'Home' },
  {
    path: '/room/:roomId',
    name: 'room',
    component: Room,
    props: true,
    meta: { requiresAuth: true },
    redirect: (to) => {
      return { path: `/room/${to.params.roomId}/messages` };
    },
    children: [
      {
        path: 'messages',
        name: 'messages',
        component: Messages,
        props: true,
        meta: { requiresAuth: true },
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.meta) {
    const loggedIn = await auth.isSignedIn();
    if (to.meta.requiresAuth && !loggedIn) {
      next({ name: 'Home' });
      return;
    }
  }
  next();
});
