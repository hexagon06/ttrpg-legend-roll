import { defineStore } from 'pinia';
import { Room } from './room';
import { useRoomApi } from './roomApi';
import { useUserStore } from '@/components/user/userStore';
import { Referenced } from '@/types/data';

export const useRoomStore = defineStore('room', {
  state: () => ({
    rooms: [] as Referenced<Room>[],
  }),
  actions: {
    async fetch() {
      const user = useUserStore().currentUser;
      if (user === undefined) throw new Error('user is not logged in');
      const api = useRoomApi();
      const result = await api.list();
      this.$patch((state) => {
        state.rooms = result;
      });
    },
    clear() {
      this.$patch((state) => {
        state.rooms = [];
      });
    },
    async create(name: string) {
      const user = useUserStore().currentUser;
      if (user === undefined) throw new Error('Current user is undefined');
      const room = {
        name,
        roles: { [user.uid]: 'owner' },
      };
      const id = await useRoomApi().create(room);
      this.$patch((state) => {
        state.rooms = [...state.rooms, { ...room, id }];
      });
    },
  },
});
