import { createFirebaseClient, auth } from "pony-platypus-firestore-api";

export function setupFirebase() {
  const firebaseConfig = {
    // ... your configuration from the firebase console https://console.firebase.google.com/
  };
  const developmentEmulator = {
    host: "localhost",
    port: 8080,
  };
  createFirebaseClient(firebaseConfig, undefined, developmentEmulator);
}

export function setupAuth() {
  return auth.useAuth("#firebaseui-auth-container", {
    url: "http://localhost:9099",
  });
}
