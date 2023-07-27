import { auth } from '@/api';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { defineStore } from 'pinia';
import { usePlayerStore } from '../player/player-store';

export const useUserStore = defineStore('users', {
  state: () => {
    return {
      currentUser: undefined as undefined | User,
      isSigningIn: false,
      isSigningOut: false,
    };
  },
  getters: {
    isSignedIn(): boolean {
      return this.currentUser !== undefined;
    },
  },
  actions: {
    async signOut(): Promise<void> {
      this.isSigningOut = true;
      usePlayerStore().clear();
      await signOut(auth.auth);
      this.currentUser = undefined;
      this.isSigningOut = false;
    },
    async signIn(user: User) {
      this.currentUser = user;
      if (user) {
        await usePlayerStore().loadCurrentPlayer(user.uid);
      }
    },
  },
});

onAuthStateChanged(auth.auth, async (user) => {
  if (user) {
    await useUserStore().signIn(user);
  } else {
    await useUserStore().signOut();
  }
});
