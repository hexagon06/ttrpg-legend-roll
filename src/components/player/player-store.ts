import { defineStore } from 'pinia';
import { Player } from './player';
import { usePlayerApi } from './player-api';
import { where } from 'firebase/firestore';
import { useUserStore } from '../user/userStore';
import { Referenced } from 'pony-platypus-firestore-api';

export const usePlayerStore = defineStore('player', {
  state: () => {
    return {
      currentPlayer: undefined as Referenced<Player> | undefined,
    };
  },
  actions: {
    async loadCurrentPlayer(uid: string) {
      const current = await usePlayerApi().queryConstraint(
        where('uid', '==', uid)
      );
      if (current.length === 0) return;
      if (current.length === 1) {
        this.currentPlayer = current[0];
        return this.currentPlayer;
      }
      throw new Error('multiple players were found for the current user');
    },
    async hasPlayer(uid: string) {
      if (this.$state.currentPlayer?.uid) return true;
      const player = await this.loadCurrentPlayer(uid);
      return player?.uid !== undefined;
    },
    async createCurrentPlayer(player: Omit<Player, 'uid'>) {
      const user = useUserStore().currentUser;
      if (user === undefined) throw new Error('user should be defined');
      const newPlayer = { ...player, uid: user.uid };
      const id = await usePlayerApi().create(newPlayer);
      this.$patch((state) => {
        state.currentPlayer = {
          ...newPlayer,
          id,
        };
      });
    },
    async patchCurrentPlayer(player: Referenced<Player>) {
      const user = useUserStore().currentUser;
      if (user === undefined) throw new Error('user should be defined');
      if (user.uid !== player.uid) {
        throw new Error(
          'current user should only be able to edit current player'
        );
      }
      await usePlayerApi().update(player);
      this.$patch((state) => {
        state.currentPlayer = player;
      });
    },
    clear() {
      this.$patch((state) => {
        state.currentPlayer = undefined;
      });
    },
  },
});
