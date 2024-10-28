import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const databaseId = process.env.FIRESTORE_DATABASE_ID || '';
const app = admin.initializeApp();
export const firestore = app.firestore();
firestore.settings({ ignoreUndefinedProperties: true, databaseId });

class FirestoreWriter {
  public constructor(private readonly firestore: admin.firestore.Firestore) {}

  public async autoIncrementId(couterName: string): Promise<number> {
    const counterRef = this.firestore.collection(`counters`).doc(couterName);
    return this.firestore.runTransaction(async (t) => {
      const doc = await t.get(counterRef);
      if (!doc.exists) {
        t.set(counterRef, { counter_value: 1 });
        return 0;
      } else {
        t.update(counterRef, { counter_value: FieldValue.increment(1) });
      }
      return doc.data()?.counter_value;
    });
  }
}

export const firestoreWriter = new FirestoreWriter(firestore);
