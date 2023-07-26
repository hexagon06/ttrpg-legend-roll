import { defineStore } from 'pinia';
import { useMessageApi } from '../api';
import { Message } from '../types';

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [] as Message[],
    loading: false,
    initialized: false,
  }),
  actions: {
    async fetchFor(roomId: string) {
      this.$state.loading = true;
      const messageApi = useMessageApi(roomId);
      const messages = await messageApi.list();
      this.$patch((state) => {
        state.messages = messages;
        state.loading = false;
        this.initialized = true;
      });
      const { unsub } = messageApi.subscribeQuery((update) => {
        this.$patch((state) => {
          state.messages = update;
        });
      });
      return { unsub };
    },
    async addMessageTo(message: Message, roomId: string) {
      const id = await useMessageApi(roomId).create(message);
      message.id = id;
      this.$patch((state) => {
        state.messages = [...state.messages, message];
      });
    },
  },
});
