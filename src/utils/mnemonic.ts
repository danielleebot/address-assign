import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Network, networkMetadata } from '../constants';
import { decryptSymmetric } from './hsm';

// default
export const MNEMONIC_DEFAULT = 'test test test test test test test test test test test junk';

// secret manager
const client = new SecretManagerServiceClient();

export async function getSecret(secretName: string): Promise<{
  secret: string;
  version: number;
}> {
  // load secret from secret manager
  const projectId = await client.getProjectId();
  const secretVersionPath = client.secretVersionPath(projectId, secretName, 'latest');
  const [accessResponse] = await client.accessSecretVersion({ name: secretVersionPath });

  if (!accessResponse.payload?.data) throw new Error('secret not found');
  const secret: string = accessResponse.payload.data.toString();
  const version = parseInt(accessResponse.name?.split('/').pop() as string);
  return { secret, version };
}

export async function loadMnemonic(network: Network): Promise<{
  mnemonic: string;
  version: number;
}> {
  // load mnemonic from secret manager
  const { mnemonicKey } = networkMetadata[network];
  const { secret, version } = await getSecret(mnemonicKey);
  const mnemonic = await decryptSymmetric(secret);
  return { mnemonic, version };
}
