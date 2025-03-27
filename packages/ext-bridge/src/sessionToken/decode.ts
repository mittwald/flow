import { debug } from "@/debug";
import { ExtBridgeError } from "@/error";
import { sessionTokenPayload } from "@/sessionToken/schemas";
import type { SessionTokenPayload } from "@/sessionToken/types";
import { decodeJwt } from "jose";

type JwtPayloadType = Omit<SessionTokenPayload, "userId">;

export const decode = (sessionToken: string) => {
  const dbgSession = `...${sessionToken.slice(-5)}`;
  debug("decoding session token (token: %s)", dbgSession);

  const {
    sub,
    aud: ignoredAud,
    exp: ignoredExp,
    iat: ignoredIat,
    iss: ignoredIss,
    jti: ignoredJti,
    nbf: ignoredNbf,
    ...rest
  } = decodeJwt<JwtPayloadType>(sessionToken);

  debug("parsing session token payload (token: %s)", dbgSession);
  const parsed = sessionTokenPayload.safeParse({
    userId: sub,
    ...rest,
  });

  if (parsed.error) {
    throw new ExtBridgeError(
      "Session token payload invalid: " + parsed.error.message,
    );
  }

  return parsed.data;
};
