import { IdItem, Referenced } from '@/types/data';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  onSnapshot,
  Query,
  query,
  QueryConstraint,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { cloneDeep } from 'lodash';
import { getCollection } from './firestore-utils/firestoreUtils';

/**
 * Interface with the Firestore using different CRUD actions.
 */
export class FirestoreAcces<T extends IdItem> {
  // https://firebase.google.com/docs/firestore/manage-data/add-data
  // https://firebase.google.com/docs/firestore/query-data/get-data

  constructor(private readonly db: Firestore, private readonly path: string) {}

  ref() {
    return collection(this.db, this.path);
  }

  async get(): Promise<T[]> {
    try {
      const result = await getCollection(this.db, this.path);
      return result.docs.map<T>((value) => {
        return { ...(value.data() as T), id: value.id };
      });
    } catch (error) {
      throw new Error(`Error fetching collection "${this.path}": 
        ${error}`);
    }
  }

  async getById(id: string): Promise<T | undefined> {
    try {
      const docRef = doc(this.db, this.path, id);
      const result = await getDoc(docRef);
      if (result.exists()) {
        return { ...(result.data() as T), id: result.id };
      } else {
        return undefined;
      }
    } catch (error) {
      throw new Error(`Error fetching document from "${this.path}": 
        ${error}`);
    }
  }

  getCollection() {
    return collection(this.db, this.path);
  }

  async queryConstraint(
    ...constraint: QueryConstraint[]
  ): Promise<Referenced<T>[]> {
    try {
      const ref = collection(this.db, this.path);
      const docs = await getDocs(query(ref, ...constraint));
      return docs.docs.map((d) => {
        return {
          ...(d.data() as T),
          id: d.id,
        };
      });
    } catch (error) {
      throw new Error(`Error querying on "${this.path}": 
        ${error}`);
    }
  }

  async query(q: Query): Promise<Referenced<T>[]> {
    try {
      const docs = await getDocs(q);
      return docs.docs.map((d) => {
        return {
          ...(d.data() as T),
          id: d.id,
        };
      });
    } catch (error) {
      throw new Error(`Error querying on "${this.path}": 
        ${error}`);
    }
  }

  async add(item: T): Promise<string> {
    // https://firebase.google.com/docs/firestore/manage-data/add-data#add_a_document
    try {
      delete item.id;
      const reference = await addDoc(collection(this.db, this.path), item);
      return reference.id;
    } catch (error) {
      throw new Error(`Error adding document to collection"${this.path}": 
        ${error}`);
    }
  }

  async addAt(item: T, path: string): Promise<void> {
    try {
      delete item.id;
      await setDoc(doc(this.db, this.path, path), item);
    } catch (error) {
      throw new Error(`Error adding document to collection "${this.path}" at ${path}: 
        ${error}`);
    }
  }

  async update(item: T): Promise<void> {
    // https://firebase.google.com/docs/firestore/manage-data/add-data#update-data
    const { id } = item;
    if (id === undefined)
      throw new Error('item.id is undefined, use add(item) instead');
    const entity = cloneDeep(item) as IdItem;
    delete entity.id;
    try {
      await updateDoc(doc(this.db, this.path, id), entity);
    } catch (error) {
      throw new Error(`Error updating document in "${this.path}": 
        ${error}`);
    }
  }

  async delete(item: T): Promise<void> {
    const { id } = item;
    if (id === undefined)
      throw new Error('item.id is undefined, is this item stored?');
    try {
      await deleteDoc(doc(this.db, this.path, id));
    } catch (error) {
      throw new Error(`Error deleting document in "${this.path}": 
        ${error}`);
    }
  }

  subscribe(updateHandler: (item: T) => void, id: string) {
    const docRef = doc(this.db, this.path, id);
    const unsub = onSnapshot(
      docRef,
      (snapshot) => {
        updateHandler({ ...(snapshot.data() as T), id: snapshot.id });
      },
      (error) => console.error(error)
    );
    return { unsub };
  }

  subscribeQuery(
    updateHandler: (items: T[]) => void,
    ...constraint: QueryConstraint[]
  ) {
    const ref = collection(this.db, this.path);
    const unsub = onSnapshot(
      query(ref, ...constraint),
      (snapshot) => {
        updateHandler(
          snapshot.docs.map((d) => {
            return {
              ...(d.data() as T),
              id: d.id,
            };
          })
        );
      },
      (error) => console.error(error)
    );
    return { unsub };
  }
}
