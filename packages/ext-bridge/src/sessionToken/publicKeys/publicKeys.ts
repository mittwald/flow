import { fetchPublicKey } from "@/sessionToken/publicKeys/fetchPublicKey";
import { importSPKI } from "jose";

const cache = new Map<string, CryptoKey>();

export const getPublicKey = async (serial: string): Promise<CryptoKey> => {
  const cached = cache.get(serial);
  if (cached) {
    return cached;
  }

  const publicKeyFromApi = await fetchPublicKey(serial);
  const cryptoKey = await importSPKI(publicKeyFromApi, "Ed25519");

  cache.set(serial, cryptoKey);
  return cryptoKey;
};
