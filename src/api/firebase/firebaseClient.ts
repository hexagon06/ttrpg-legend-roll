// Import the functions you need from the SDKs you need
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { Analytics, getAnalytics } from 'firebase/analytics';
import {
  connectFirestoreEmulator,
  EmulatorMockTokenOptions,
  Firestore,
  initializeFirestore,
} from 'firebase/firestore';

export interface FirebaseClient {
  readonly app: FirebaseApp;
  readonly analytics: Analytics;
  readonly store: Firestore;
}

class FirebaseClientImpl implements FirebaseClient {
  public readonly app: FirebaseApp;
  public readonly analytics: Analytics;
  public readonly store: Firestore;

  constructor(
    options: FirebaseOptions,
    developInEmulator?: FirestoreEmulatorConfiguration
  ) {
    this.app = initializeApp(options);
    this.store = initializeFirestore(this.app, {
      ignoreUndefinedProperties: true,
    });
    this.analytics = getAnalytics(this.app);

    if (developInEmulator && process.env.NODE_ENV === 'development') {
      const { host, port, options: emulatorOptions } = developInEmulator;
      connectFirestoreEmulator(this.store, host, port, emulatorOptions);
    }
  }
}

export type FirestoreEmulatorConfiguration = {
  host: string;
  port: number;
  options?:
    | {
        mockUserToken?: string | EmulatorMockTokenOptions | undefined;
      }
    | undefined;
};

const clients = {} as { [key: string]: FirebaseClient };

/**
 * Create a new FirebaseClient to use in the genericApi implementations.
 * @param options Your web app's Firebase configuration, For Firebase JS SDK v7.20.0 and later, measurementId is optional
 * @param id If you want to use multiple firestores, use this id to differentiate between them. Use this id when creating the api implementation
 * @param developInEmulator if specified the client will use the firestore emulator when in development mode
 */
export function createFirebaseClient(
  options: FirebaseOptions,
  id?: string,
  developInEmulator?: FirestoreEmulatorConfiguration
) {
  if (id === '') throw new Error('An empty string is not a valid id');
  if (id === undefined && clients[''] !== undefined)
    throw new Error('A client without id was already created');
  if (id && clients[id] !== undefined)
    throw new Error(`A client with id '${id}' was already created`);

  clients[id ?? ''] = new FirebaseClientImpl(options, developInEmulator);
}

/**
 * Use the firebase client for access to firebase features
 * @param id If you created a client with an id specify that you want to use that
 * @returns A firebase client created with `createFirebaseClient(...)` with a matching id
 */
export function useFirebaseClient(id?: string): FirebaseClient {
  if (id === '') throw new Error('An empty string is not a valid id');
  const client = clients[id ?? ''];
  if (client === undefined && id === undefined)
    throw new Error(
      'No client without id was created yet, please use `createFirebaseClient` first'
    );
  if (client === undefined)
    throw new Error(
      `No client with id '${id}' was created yet, please use \`createFirebaseClient\` first`
    );

  return client;
}

export default {
  create: createFirebaseClient,
  use: useFirebaseClient,
};
