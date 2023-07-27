import { Room } from './room';
import { Api } from '@/api/firebase';
import { PROJECT_PREFIX } from '@/api/apiSetup';

const ROOM_COLLECTION = 'rooms';

export function useRoomApi() {
  return new Api<Room>(`${PROJECT_PREFIX}/${ROOM_COLLECTION}`);
}
