import { fetchPublicKey } from "@/sessionToken/publicKeys/fetchPublicKey";
import type { PublicKey } from "@/sessionToken/publicKeys/types";

const cache = new Map<string, PublicKey>();

export const getPublicKey = async (serial: string): Promise<PublicKey> => {
  const cached = cache.get(serial);
  if (cached) {
    return cached;
  }

  const publicKeyFromApi = await fetchPublicKey(serial);
  // @todo: result musst be converted into real key
  const publicKey = publicKeyFromApi as PublicKey;
  cache.set(serial, publicKey);

  return publicKey;
};
