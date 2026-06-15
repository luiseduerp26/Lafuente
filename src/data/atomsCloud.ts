import { MenuItem } from '../types';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
    },
    operationType,
    path
  };
  console.error('AtomsCloud Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * AtomsCloud Service - Real-time cloud-synchronized database using Firestore
 * Enables viewing correct menus and information on any device in real-time.
 */
export async function fetchFromCloud(key: string): Promise<any> {
  const docPath = `atomscloud/${key}`;
  try {
    const docRef = doc(db, 'atomscloud', key);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data().value;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, docPath);
    return null;
  }
}

export async function saveToCloud(key: string, value: any): Promise<boolean> {
  const docPath = `atomscloud/${key}`;
  try {
    const docRef = doc(db, 'atomscloud', key);
    await setDoc(docRef, { 
      value,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
    return false;
  }
}

/**
 * Listens to a document path in real-time and executes the callback on modifications.
 */
export function subscribeToCloud(key: string, callback: (value: any) => void): () => void {
  const docPath = `atomscloud/${key}`;
  const docRef = doc(db, 'atomscloud', key);
  
  const unsubscribe = onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data().value);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, docPath);
  });
  
  return unsubscribe;
}
