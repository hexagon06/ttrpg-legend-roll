import { Room } from "../types";
import { Api } from "pony-platypus-firestore-api";

const ROOM_COLLECTION = "rooms";

export function useRoomApi() {
  return new Api<Room>(ROOM_COLLECTION);
}
