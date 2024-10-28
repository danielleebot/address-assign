import tokens from './networks.json';

export const networkMetadata = tokens as Record<string, INetworkMetadata>;

export declare type Network = 'solana';

declare interface INetworkMetadata {
  /**
   * @example 9
   */
  decimals: number;
  /**
   * @example "m/44'/501'/0'/0'"
   */
  bip32PathPrefix: string;
  /**
   * @example "SOLANA_MNEMONIC"
   */
  mnemonicKey: string;
}
