import { defineStore } from "pinia";
import { Room } from "@/types";
import { useRoomApi } from "@/api/roomApi";
import { useUserStore } from "./userStore";
import { Referenced, userHasRole } from "pony-platypus-firestore-api";
import { DocumentData, or, query, where } from "firebase/firestore";

export const useRoomStore = defineStore("room", {
  state: () => ({
    rooms: [] as Referenced<Room>[],
  }),
  actions: {
    async fetch() {
      const user = useUserStore().currentUser;
      if (user === undefined) throw new Error("user is not logged in");
      const api = useRoomApi();
      const q = query(
        api.collection(),
        // where("members", "array-contains", user.uid)
        // where("ownerId", "==", user.displayName)
        or(userHasRole(user, "owner"), userHasRole(user, "member"))
      );
      const result = await api.query(q);
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
      if (user === undefined) throw new Error("Current user is undefined");
      const room = {
        name,
        roles: { [user.uid]: "owner" },
      };
      const id = await useRoomApi().create(room);
      this.$patch((state) => {
        state.rooms = [...state.rooms, { ...room, id }];
      });
    },
  },
});
