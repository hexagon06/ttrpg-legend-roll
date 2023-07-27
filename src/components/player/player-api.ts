import { Api } from '@/api/firebase';
import { PROJECT_PREFIX } from '@/api/apiSetup';
import { Player } from './player';

const PLAYER_COLLECTION = 'players';

export function usePlayerApi() {
  return new Api<Player>(`${PROJECT_PREFIX}/${PLAYER_COLLECTION}`);
}
