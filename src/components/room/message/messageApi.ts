import { Message } from './message';
import { useRoomApi } from '../roomApi';

const ENCOUNTER_COLLECTION = 'messages';

export function useMessageApi(roomId: string) {
  return useRoomApi().childOf<Message>(roomId, ENCOUNTER_COLLECTION);
}
