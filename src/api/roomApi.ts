import { Room } from '../types';
import { Api } from 'pony-platypus-firestore-api';
import { PROJECT_PREFIX } from './apiSetup';

const ROOM_COLLECTION = 'rooms';

export function useRoomApi() {
  return new Api<Room>(`${PROJECT_PREFIX}/${ROOM_COLLECTION}`);
}
