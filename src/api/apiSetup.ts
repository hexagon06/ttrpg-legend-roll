import { createFirebaseClient, auth } from './firebase';

export function setupFirebase() {
  const firebaseConfig = {
    apiKey: 'AIzaSyA8ek7N1M-4yXV6fflFB8Lw7Z_WhiDyBko',
    authDomain: 'ttrpg-legend.firebaseapp.com',
    projectId: 'ttrpg-legend',
    storageBucket: 'ttrpg-legend.appspot.com',
    messagingSenderId: '248062481822',
    appId: '1:248062481822:web:934d8e7e3a2c097846b28f',
    measurementId: 'G-4C883FZTE9',
  };
  const developmentEmulator = {
    host: 'localhost',
    port: 8080,
  };
  createFirebaseClient(firebaseConfig, undefined, developmentEmulator);
}

export function setupAuth() {
  return auth.useAuth('#firebaseui-auth-container', {
    url: 'http://localhost:9099',
  });
}
// note that this needs a slash in the prefix because the path needs to have an odd number of segments
export const PROJECT_PREFIX = 'ttrpg-legend/roll';
