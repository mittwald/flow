import { debug } from "@/debug";
import { fetchPublicKey } from "@/sessionToken/publicKeys/fetchPublicKey";
import { importSPKI } from "jose";

const cache = new Map<string, CryptoKey>();

export const getPublicKey = async (serial: string): Promise<CryptoKey> => {
  debug("getting public key (serial: %s)", serial);
  const cached = cache.get(serial);
  if (cached) {
    debug("using cached public key (serial: %s)", serial);
    return cached;
  }

  const publicKeyFromApi = await fetchPublicKey(serial);
  debug("importing SPKI (serial: %s)", serial);
  const cryptoKey = await importSPKI(publicKeyFromApi, "Ed25519");

  cache.set(serial, cryptoKey);
  return cryptoKey;
};
