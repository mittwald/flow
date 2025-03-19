import { sessionTokenPayload } from "@/sessionToken/schemas";
import type { SessionTokenPayload } from "@/sessionToken/types";
import { decodeJwt } from "jose";

type JwtPayloadType = Omit<SessionTokenPayload, "userId">;

export const decode = (jwt: string) => {
  const {
    sub,
    aud: ignoredAud,
    exp: ignoredExp,
    iat: ignoredIat,
    iss: ignoredIss,
    jti: ignoredJti,
    nbf: ignoredNbf,
    ...rest
  } = decodeJwt<JwtPayloadType>(jwt);

  const parsed = sessionTokenPayload.safeParse({
    userId: sub,
    ...rest,
  });

  if (parsed.error) {
    throw new Error("Session token payload invalid: " + parsed.error.message);
  }

  return parsed.data;
};
