import { ExtBridgeError } from "@/error";
import type { VerifyOptions } from "@/sessionToken/verify";
import { generateKeyPair, SignJWT } from "jose";
import { beforeAll, describe, expect, it, vi } from "vitest";

const keys = vi.hoisted(() => ({ publicKey: undefined as unknown }));

vi.mock("@/sessionToken/publicKeys", () => ({
  getPublicKey: async () => keys.publicKey,
}));

const { verify } = await import("@/sessionToken/verify");

const extensionId = "extension-a";
let privateKey: CryptoKey;

const signSessionToken = (audience?: string) => {
  const jwt = new SignJWT({
    sessionId: "session-id",
    extensionId: audience ?? extensionId,
    extensionInstanceId: "extension-instance-id",
    contextId: "context-id",
    context: "project",
    scopes: [],
    authenticatableWithoutSecret: false,
    publicKeySerial: "serial",
  })
    .setProtectedHeader({ alg: "EdDSA" })
    .setSubject("user-id")
    .setIssuedAt()
    .setExpirationTime("1m");

  if (audience) {
    jwt.setAudience(audience);
  }
  return jwt.sign(privateKey);
};

beforeAll(async () => {
  const pair = await generateKeyPair("EdDSA", { crv: "Ed25519" });
  privateKey = pair.privateKey;
  keys.publicKey = pair.publicKey;
});

describe("verify", () => {
  it("accepts a session token issued for the given extension", async () => {
    const token = await signSessionToken(extensionId);
    const decoded = await verify(token, { extensionId });
    expect(decoded.userId).toBe("user-id");
    expect(decoded.extensionId).toBe(extensionId);
  });

  it("rejects a session token issued for another extension", async () => {
    const token = await signSessionToken("extension-b");
    await expect(verify(token, { extensionId })).rejects.toBeInstanceOf(
      ExtBridgeError,
    );
  });

  it("rejects a session token without audience", async () => {
    const token = await signSessionToken();
    await expect(verify(token, { extensionId })).rejects.toBeInstanceOf(
      ExtBridgeError,
    );
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
