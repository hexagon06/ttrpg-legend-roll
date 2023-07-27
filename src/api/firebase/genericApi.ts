import {
  CollectionReference,
  DocumentData,
  Query,
  QueryConstraint,
} from 'firebase/firestore';
import client, { FirebaseClient } from './firebaseClient';
import { FirestoreAcces } from './firestoreAccess';
import { IdItem, Referenced } from '@/types/data';
import { Unsubscribe } from 'firebase/auth';

export interface ApiFor<T> {
  get(id: string): Promise<Referenced<T> | undefined>;
  query(q: Query): Promise<Referenced<T>[]>;
  queryConstraint(...constraint: QueryConstraint[]): Promise<Referenced<T>[]>;
  create(creature: IdItem & T): Promise<string>;
  delete(creature: Referenced<T>): Promise<void>;
  update(creature: Referenced<T>): Promise<void>;
  list(): Promise<Referenced<T>[]>;
  childOf<C extends IdItem>(id: string, childPath: string): Api<C>;
  subscribe(
    updateHandler: (item: Referenced<T>) => void,
    id: string
  ): { unsub: Unsubscribe };
  subscribeQuery(
    updateHandler: (items: Referenced<T>[]) => void,
    ...constraint: QueryConstraint[]
  ): { unsub: Unsubscribe };
  collection(): CollectionReference<DocumentData, DocumentData>;
}

/**
 * Interface with the Firestore using different CRUD actions.
 */
export class Api<T> implements ApiFor<T> {
  readonly firebaseClient: FirebaseClient;

  constructor(private collectionPath: string, firebaseClientId?: string) {
    this.firebaseClient = client.use(firebaseClientId);
  }

  private getAccess<TStore extends IdItem>() {
    return new FirestoreAcces<TStore>(
      this.firebaseClient.store,
      this.collectionPath
    );
  }

  async get(id: string): Promise<Referenced<T> | undefined> {
    try {
      const firestore = this.getAccess<Referenced<T>>();
      return await firestore.getById(id);
    } catch (e) {
      throw new Error(`failed to get ${id} in ${this.collectionPath}
        ${e}`);
    }
  }

  async queryConstraint(
    ...constraint: QueryConstraint[]
  ): Promise<Referenced<T>[]> {
    try {
      const firestore = this.getAccess<Referenced<T>>();
      return await firestore.queryConstraint(...constraint);
    } catch (e) {
      throw new Error(`failed to query on ${this.collectionPath}
        ${e}`);
    }
  }
  async query(q: Query): Promise<Referenced<T>[]> {
    try {
      const firestore = this.getAccess<Referenced<T>>();
      return await firestore.query(q);
    } catch (e) {
      throw new Error(`failed to query on ${this.collectionPath}
        ${e}`);
    }
  }

  async create(entity: IdItem & T): Promise<string> {
    try {
      const firestore = this.getAccess<IdItem & T>();

      return await firestore.add(entity);
    } catch (e) {
      throw new Error(`failed to create in ${this.collectionPath}
        ${e}`);
    }
  }

  async delete(entity: Referenced<T>): Promise<void> {
    try {
      const firestore = this.getAccess<Referenced<T>>();
      await firestore.delete(entity);
    } catch (e) {
      throw new Error(`failed to delete ${entity.id} in ${this.collectionPath}
        ${e}`);
    }
  }

  async update(entity: Referenced<T>): Promise<void> {
    try {
      const firestore = this.getAccess<Referenced<T>>();
      await firestore.update(entity);
    } catch (e) {
      throw new Error(`failed to update ${entity.id} in ${this.collectionPath}
        ${e}`);
    }
  }

  async list(): Promise<Referenced<T>[]> {
    try {
      const firestore = this.getAccess<Referenced<T>>();

      return await firestore.get();
    } catch (e) {
      throw new Error(`failed to getAll in ${this.collectionPath}:
        ${e}`);
    }
  }

  public childOf<C extends IdItem>(id: string, childPath: string) {
    return new Api<C>(`${this.collectionPath}/${id}/${childPath}`);
  }

  public subscribe(
    updateHandler: (item: Referenced<T>) => void,
    id: string
  ): { unsub: Unsubscribe } {
    const firestore = this.getAccess<Referenced<T>>();
    return firestore.subscribe(updateHandler, id);
  }

  public subscribeQuery(
    updateHandler: (items: Referenced<T>[]) => void,
    ...constraint: QueryConstraint[]
  ): { unsub: Unsubscribe } {
    const firestore = this.getAccess<Referenced<T>>();
    return firestore.subscribeQuery(updateHandler, ...constraint);
  }

  public collection(): CollectionReference<DocumentData, DocumentData> {
    return this.getAccess<Referenced<T>>().getCollection();
  }
}
