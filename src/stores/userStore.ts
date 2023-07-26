import { auth } from '@/api';
// import { createLegendUser, getLegendUserFor } from '@/api/firestore-by-type/legend-user-api'
// import { LegendUser } from '@/types/legendUser'
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('users', {
  state: () => {
    return {
      currentUser: undefined as undefined | User,
      // currentLegendUser: undefined as undefined | LegendUser,
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
      await signOut(auth.auth);
      this.currentUser = undefined;
      // this.currentLegendUser = undefined
      this.isSigningOut = false;
    },
    async signIn(user: User) {
      this.currentUser = user;
      // if (user) {
      //   const legendUser = await getLegendUserFor(user.uid);
      //   if (legendUser) {
      //     this.currentLegendUser = legendUser
      //   } else {
      //     this.currentLegendUser = await createLegendUser(user)
      //   }
      // } else {
      //   this.currentLegendUser = undefined
      // }
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
