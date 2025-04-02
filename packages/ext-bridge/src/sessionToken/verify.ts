import { debug } from "@/debug";
import { decode } from "@/sessionToken/decode";
import { getPublicKey } from "@/sessionToken/publicKeys";
import { jwtVerify } from "jose";

export const verify = async (sessionToken: string) => {
  const dbgSession = `...${sessionToken.slice(-5)}`;
  const decoded = decode(sessionToken);
  const publicKey = await getPublicKey(decoded.publicKeySerial);
  debug("verifying session token (token: %s)", dbgSession);
  await jwtVerify(sessionToken, publicKey);
  return decoded;
};
