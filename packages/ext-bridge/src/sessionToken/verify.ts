import { decode } from "@/sessionToken/decode";
import { getPublicKey } from "@/sessionToken/publicKeys";
import { jwtVerify } from "jose";

export const verify = async (sessionToken: string) => {
  const decoded = decode(sessionToken);
  const publicKey = await getPublicKey(decoded.publicKeySerial);
  await jwtVerify(sessionToken, publicKey);
  return decoded;
};
