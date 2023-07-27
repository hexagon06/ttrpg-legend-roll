import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';
import Home from './views/Home.vue';
import Messages from './views/Messages.vue';
import Room from './components/room/Room.vue';
import { auth } from './api';
import { usePlayerStore } from './components/player/player-store';
import NewPlayer from '@/components/player/NewPlayer.vue';
import EditPlayer from '@/components/player/Editplayer.vue';

const NEW_PLAYER = 'New Player';

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/new-here', name: NEW_PLAYER, component: NewPlayer },
  {
    path: '/player/:playerId/edit',
    name: 'player-edit',
    component: EditPlayer,
    props: true,
  },
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
  const user = auth.auth.currentUser;
  if (
    user &&
    to.name !== NEW_PLAYER &&
    !(await usePlayerStore().hasPlayer(user.uid))
  ) {
    next({ name: NEW_PLAYER });
    return;
  }
  next();
});
