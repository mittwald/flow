import { ExtBridgeError } from "@/error";
import { decode } from "@/sessionToken/decode";
import { getPublicKey } from "@/sessionToken/publicKeys";
import { jwtVerify } from "jose";
import { JWTClaimValidationFailed } from "jose/errors";

export interface VerifyOptions {
  /**
   * The ID of your extension. The session token is only accepted if it was
   * issued for this extension (`aud` claim).
   */
  extensionId: string;
}

export const verify = async (sessionToken: string, options: VerifyOptions) => {
  const extensionId = options?.extensionId;
  if (typeof extensionId !== "string" || extensionId === "") {
    throw new ExtBridgeError(
      "verify() requires `extensionId` to check the session token was issued for your extension",
    );
  }

  const decoded = decode(sessionToken);
  const publicKey = await getPublicKey(decoded.publicKeySerial);

  try {
    await jwtVerify(sessionToken, publicKey, {
      audience: extensionId,
      algorithms: ["EdDSA"],
    });
  } catch (error) {
    if (error instanceof JWTClaimValidationFailed && error.claim === "aud") {
      throw new ExtBridgeError(
        "Session token was not issued for this extension",
      );
    }
    throw error;
  }

  return decoded;
};
