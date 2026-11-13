import { ExtBridgeError } from "@/error";
import type { VerifyOptions } from "@/sessionToken/verify";
import { generateKeyPair, SignJWT } from "jose";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const keys = vi.hoisted(() => ({
  publicKey: undefined as unknown,
  getPublicKey: vi.fn(() => Promise.resolve(undefined as unknown)),
}));

vi.mock("@/sessionToken/publicKeys", () => ({
  getPublicKey: keys.getPublicKey,
}));

const { verify } = await import("@/sessionToken/verify");

const extensionId = "extension-a";
const defaultPublicKeySerial = "9a5aeb8d-0081-4adb-88ad-bdfc6ed1d94e";
let privateKey: CryptoKey;
let publicKey: CryptoKey;

const signSessionToken = (
  audience?: string | string[],
  publicKeySerial = defaultPublicKeySerial,
  signingKey = privateKey,
  algorithm = "EdDSA",
) => {
  const jwt = new SignJWT({
    sessionId: "session-id",
    extensionId: [audience].flat()[0] ?? extensionId,
    extensionInstanceId: "extension-instance-id",
    contextId: "context-id",
    context: "project",
    scopes: [],
    authenticatableWithoutSecret: false,
    publicKeySerial,
  })
    .setProtectedHeader({ alg: algorithm })
    .setSubject("user-id")
    .setIssuedAt()
    .setExpirationTime("1m");

  if (audience) {
    jwt.setAudience(audience);
  }
  return jwt.sign(signingKey);
};

beforeAll(async () => {
  const pair = await generateKeyPair("EdDSA", { crv: "Ed25519" });
  privateKey = pair.privateKey;
  publicKey = pair.publicKey;
});

beforeEach(() => {
  keys.publicKey = publicKey;
  keys.getPublicKey.mockClear();
  keys.getPublicKey.mockImplementation(async () => keys.publicKey);
});

describe("verify", () => {
  it("accepts a session token issued for the given extension", async () => {
    const token = await signSessionToken(extensionId);
    const decoded = await verify(token, { extensionId });
    expect(decoded.userId).toBe("user-id");
    expect(decoded.extensionId).toBe(extensionId);
  });

  it.each([
    ["extension-b", "extension-b"],
    [["extension-b", "extension-c"], "extension-b, extension-c"],
  ])(
    "rejects a session token issued for %j and names both IDs",
    async (audience, issuedFor) => {
      const token = await signSessionToken(audience);
      const error = await verify(token, { extensionId }).catch((e) => e);

      expect(error).toBeInstanceOf(ExtBridgeError);
      expect(error.message).toContain(issuedFor);
      expect(error.message).toContain(extensionId);
    },
  );

  it("rejects a session token without audience as missing aud", async () => {
    const token = await signSessionToken();
    const error = await verify(token, { extensionId }).catch((e) => e);

    expect(error).toBeInstanceOf(ExtBridgeError);
    expect(error.message).toContain("no audience (aud) claim");
  });

  it.each([".", "..", "../other", "a?b=c", "a/b", "latest", "a".repeat(129)])(
    "rejects the invalid public key serial %s before lookup",
    async (serial) => {
      const token = await signSessionToken(extensionId, serial);

      await expect(verify(token, { extensionId })).rejects.toBeInstanceOf(
        ExtBridgeError,
      );
      expect(keys.getPublicKey).not.toHaveBeenCalled();
    },
  );

  it("accepts an uppercase public key serial", async () => {
    const serial = "9A5AEB8D-0081-4ADB-88AD-BDFC6ED1D94F";
    const token = await signSessionToken(extensionId, serial);

    await expect(verify(token, { extensionId })).resolves.toBeDefined();
    expect(keys.getPublicKey).toHaveBeenCalledWith(serial);
  });

  it("rejects a token using an algorithm outside the allowlist", async () => {
    const pair = await generateKeyPair("RS256");
    keys.publicKey = pair.publicKey;
    const token = await signSessionToken(
      extensionId,
      "9a5aeb8d-0081-4adb-88ad-bdfc6ed1d950",
      pair.privateKey,
      "RS256",
    );

    await expect(verify(token, { extensionId })).rejects.toThrow();
  });

  it.each([
    ["no options", undefined],
    ["no extensionId", {}],
    ["an empty extensionId", { extensionId: "" }],
  ])("rejects verification with %s", async (_, options) => {
    const token = await signSessionToken(extensionId);
    await expect(
      verify(token, options as unknown as VerifyOptions),
    ).rejects.toBeInstanceOf(ExtBridgeError);
  });
});
