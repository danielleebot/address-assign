import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { Network, networkMetadata } from '../constants';
import { AssignResponse, IKMS, ITransactionSigned } from '../interfaces';
import { firestore, firestoreWriter } from '../utils';

export abstract class CommonTransactionService {
  protected abstract network: Network;
  public version: number = 0;

  public abstract init(): Promise<void>;

  protected abstract computeAddress(path: string): string;

  public async assignWallet(params: Pick<IKMS, 'uid'>): Promise<AssignResponse> {
    const walletRef = firestore.collection('wallets').doc(this.network).collection('uid').doc(params.uid);
    const walletDoc = await walletRef.get();
    if (walletDoc.exists) {
      const walletData = walletDoc.data() as IKMS;
      return walletData;
    }

    const pid = await firestoreWriter.autoIncrementId(this.network);
    const path: string = networkMetadata[this.network].bip32PathPrefix.replace('{index}', pid.toString());
    const address: string = this.computeAddress(path);
    const version = this.version;
    const walletData: IKMS = {
      uid: params.uid,
      pid,
      network: this.network,
      path,
      address,
      version,
      timestamp: FieldValue.serverTimestamp(),
    };
    await walletRef.set(walletData);
    console.log(JSON.stringify({ uid: params.uid, network: this.network, address, version }));
    return { uid: params.uid, network: this.network, address, version, timestamp: Timestamp.now() };
  }

  public abstract signTransaction(params: any): Promise<ITransactionSigned>;
}
