import { setupAuth, setupFirebase } from './apiSetup';

setupFirebase();
export const auth = setupAuth();
