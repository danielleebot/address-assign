import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { Network } from '../constants';

export declare interface IKMS {
  /**
   * @example "1234567890abcdefghijklmnopqr"
   * @minLength 1
   * @maxLength 64
   */
  uid: string;
  /**
   * @isLong ErrorMessage
   * @minimum 0
   * @example 0
   */
  pid: number;
  /**
   * @example "ethereum"
   * @minLength 1
   * @maxLength 64
   */
  network: Network;
  /**
   * @example "m/44'/60'/0'/0/0"
   */
  path: string;
  /**
   * @example "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
   * @pattern ^0x[a-fA-F0-9]{40}$
   * @minLength 42
   * @maxLength 42
   */
  address: string;
  /**
   * @isLong ErrorMessage
   * @minimum 1
   * @example 1
   */
  version: number;
  timestamp: Timestamp | FieldValue;
}

export declare type AssignResponse = Pick<IKMS, 'uid' | 'network' | 'address' | 'version' | 'timestamp'>;
