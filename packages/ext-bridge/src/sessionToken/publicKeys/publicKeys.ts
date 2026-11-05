import { ExtBridgeError } from "@/error";
import { fetchPublicKey } from "@/sessionToken/publicKeys/fetchPublicKey";
import { isValidPublicKeySerial } from "@/sessionToken/publicKeys/serial";
import { importSPKI } from "jose";

const cache = new Map<string, CryptoKey>();
const failedLookupCache = new Map<string, number>();
const FAILED_LOOKUP_TTL_MS = 60_000;
const FAILED_LOOKUP_MAX_ENTRIES = 1000;

const cacheFailedLookup = (serial: string) => {
  if (failedLookupCache.size >= FAILED_LOOKUP_MAX_ENTRIES) {
    const oldestSerial = failedLookupCache.keys().next().value;
    if (oldestSerial !== undefined) {
      failedLookupCache.delete(oldestSerial);
    }
  }

  failedLookupCache.set(serial, Date.now() + FAILED_LOOKUP_TTL_MS);
};

export const getPublicKey = async (serial: string): Promise<CryptoKey> => {
  if (!isValidPublicKeySerial(serial)) {
    throw new ExtBridgeError("Session token public key serial invalid");
  }

  const cached = cache.get(serial);
  if (cached) {
    return cached;
  }

  const failedLookupExpiry = failedLookupCache.get(serial);
  if (failedLookupExpiry !== undefined) {
    if (failedLookupExpiry > Date.now()) {
      throw new ExtBridgeError(
        "Public key lookup for this serial failed recently",
      );
    }
    failedLookupCache.delete(serial);
  }

  try {
    const publicKeyFromApi = await fetchPublicKey(serial);
    const cryptoKey = await importSPKI(publicKeyFromApi, "Ed25519");

    cache.set(serial, cryptoKey);
    failedLookupCache.delete(serial);
    return cryptoKey;
  } catch (error) {
    cacheFailedLookup(serial);
    throw error;
  }
};

export const resetPublicKeyCaches = () => {
  cache.clear();
  failedLookupCache.clear();
};
