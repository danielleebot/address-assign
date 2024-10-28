import { crc32c } from '@aws-crypto/crc32c';
import { KeyManagementServiceClient } from '@google-cloud/kms';

const client = new KeyManagementServiceClient();
const keyName = process.env.CLOUD_KMS_ID as string;

export async function encryptSymmetric(plaintext: string): Promise<string> {
  // if (process.env.NODE_ENV === 'development') return plaintext;

  const plaintextBuffer = Buffer.from(plaintext);
  const plaintextCrc32c = crc32c(plaintextBuffer);
  const [encryptResponse] = await client.encrypt({
    name: keyName,
    plaintext: plaintextBuffer,
    plaintextCrc32c: {
      value: plaintextCrc32c,
    },
  });

  const ciphertext = encryptResponse.ciphertext as Uint8Array;

  // Optional, but recommended: perform integrity verification on encryptResponse.
  // For more details on ensuring E2E in-transit integrity to and from Cloud KMS visit:
  // https://cloud.google.com/kms/docs/data-integrity-guidelines
  if (!encryptResponse.verifiedPlaintextCrc32c) {
    throw new Error('Encrypt: request corrupted in-transit');
  }
  if (crc32c(ciphertext) !== Number(encryptResponse.ciphertextCrc32c!.value)) {
    throw new Error('Encrypt: response corrupted in-transit');
  }

  return Buffer.from(ciphertext).toString('base64');
}

export async function decryptSymmetric(ciphertext: string): Promise<string> {
  // if (process.env.NODE_ENV === 'development') return ciphertext;

  const ciphertextCrc32c = crc32c(Buffer.from(ciphertext, 'base64'));
  const [decryptResponse] = await client.decrypt({
    name: keyName,
    ciphertext: ciphertext,
    ciphertextCrc32c: {
      value: ciphertextCrc32c,
    },
  });

  // Optional, but recommended: perform integrity verification on decryptResponse.
  // For more details on ensuring E2E in-transit integrity to and from Cloud KMS visit:
  // https://cloud.google.com/kms/docs/data-integrity-guidelines
  if (crc32c(Buffer.from(decryptResponse.plaintext as string)) !== Number(decryptResponse.plaintextCrc32c!.value)) {
    throw new Error('Decrypt: response corrupted in-transit');
  }

  return decryptResponse.plaintext?.toString() as string;
}
