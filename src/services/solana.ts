import { Keypair, Transaction } from '@solana/web3.js';
import { mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { CommonTransactionService } from './common';
import { Network } from '../constants';
import { ISolanaTransaction, ITransactionSigned } from '../interfaces';
import { MNEMONIC_DEFAULT, firestore, loadMnemonic } from '../utils';

export class SolanaService extends CommonTransactionService {
  protected network: Network = 'solana';
  private mnemonic: string = MNEMONIC_DEFAULT;

  public async init(): Promise<void> {
    const { mnemonic, version } = await loadMnemonic(this.network);
    this.mnemonic = mnemonic;
    this.version = version;
    console.log('SolanaService init done');
  }

  private getKeypair(path: string) {
    const seed = mnemonicToSeedSync(this.mnemonic);
    const keypair = Keypair.fromSeed(derivePath(path, seed.toString('hex')).key);

    return keypair;
  }

  protected computeAddress(path: string): string {
    const keypair = this.getKeypair(path);

    return keypair.publicKey.toBase58();
  }

  public async signTransaction(params: ISolanaTransaction): Promise<ITransactionSigned> {
    const walletsRef = firestore.collection('wallets').doc(this.network).collection('uid');
    const walletsRes = await walletsRef.where('address', '==', params.from).get();
    if (walletsRes.size == 0) throw new Error('address not found');
    const { path } = walletsRes.docs[0].data();
    const keypair = this.getKeypair(path);
    const transaction = Transaction.from(Buffer.from(params.unsignedTxHex, 'hex'));
    const signature = nacl.sign.detached(transaction.serializeMessage(), keypair.secretKey);
    transaction.addSignature(keypair.publicKey, Buffer.from(signature));
    const rawTxHex = transaction.serialize().toString('hex');
    const txHash = bs58.encode(transaction.signature as Buffer);

    console.log(JSON.stringify({ raw: params, rawTxHex, txHash }));
    return { rawTxHex, txHash };
  }
}
