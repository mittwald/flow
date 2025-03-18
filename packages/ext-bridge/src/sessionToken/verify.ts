import { decode } from "@/sessionToken/decode";
import { getPublicKey } from "@/sessionToken/publicKeys";
import { jwtVerify } from "jose";

export const verify = async (jwt: string) => {
  const decoded = decode(jwt);
  const publicKey = await getPublicKey(decoded.publicKeySerial);
  await jwtVerify(jwt, publicKey);
  return decoded;
};
