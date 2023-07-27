import {
  getAuth,
  connectAuthEmulator,
  signOut as signAuthOut,
  GoogleAuthProvider,
  EmailAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import * as firebaseui from 'firebaseui';

export type FirebaseAuthEmulatorConfig = {
  url: string;
  options?:
    | {
        disableWarnings: boolean;
      }
    | undefined;
};

export function useAuth(
  signInElement: string | Element,
  useDevelopmentEmulator?: FirebaseAuthEmulatorConfig
) {
  const auth = getAuth();

  let isInitialized = false;
  onAuthStateChanged(auth, () => {
    isInitialized = true;
  });

  function isSignedIn(): Promise<boolean> {
    // the auth state is not resolved immediately.
    // therefore we need to use this construction for when the navigation is through a link or a refresh
    if (isInitialized) return Promise.resolve(!!auth.currentUser);
    return new Promise<boolean>((resolve) => {
      onAuthStateChanged(auth, (user) => {
        isInitialized = true;
        resolve(!!user);
      });
    });
  }

  if (useDevelopmentEmulator && process.env.NODE_ENV === 'development') {
    const { url, options } = useDevelopmentEmulator;
    connectAuthEmulator(auth, url, options);
  }

  const ui = new firebaseui.auth.AuthUI(auth);
  function signIn(): void {
    ui.start(signInElement, {
      signInFlow: 'popup',
      signInOptions: [
        // List of OAuth providers supported.
        GoogleAuthProvider.PROVIDER_ID,
        EmailAuthProvider.PROVIDER_ID,
      ],
      signInSuccessUrl: '/',
    });
  }

  async function signOut(): Promise<void> {
    return await signAuthOut(auth);
  }

  return {
    auth,
    isSignedIn,
    signIn,
    signOut,
  };
}
