import { MW_EXT_API_URL } from "@/environment";
import { ExtBridgeError } from "@/error";
import {
  getPublicKey,
  resetPublicKeyCaches,
} from "@/sessionToken/publicKeys/publicKeys";
import { exportSPKI, generateKeyPair } from "jose";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const axiosMock = vi.hoisted(() => vi.fn());

vi.mock("axios", () => ({
  default: axiosMock,
}));

let publicKeyPem: string;

beforeAll(async () => {
  const pair = await generateKeyPair("EdDSA", { crv: "Ed25519" });
  publicKeyPem = await exportSPKI(pair.publicKey);
});

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
  axiosMock.mockReset();
  resetPublicKeyCaches();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("getPublicKey", () => {
  it("rejects an invalid serial without requesting it", async () => {
    await expect(getPublicKey("a/b")).rejects.toBeInstanceOf(ExtBridgeError);
    expect(axiosMock).not.toHaveBeenCalled();
  });

  it("rejects spaces and requests an allowed serial using its encoded path", async () => {
    await expect(getPublicKey("key one")).rejects.toBeInstanceOf(
      ExtBridgeError,
    );
    expect(axiosMock).not.toHaveBeenCalled();

    const serial = "abc-1.2_3";
    axiosMock.mockResolvedValue({
      data: { key: publicKeyPem, algorithm: "EdDSA", serial },
    });

    await getPublicKey(serial);

    expect(axiosMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `${MW_EXT_API_URL}/v2/public-keys/${encodeURIComponent(serial)}`,
      }),
    );
  });

  it("caches failed lookups for 60 seconds", async () => {
    axiosMock.mockRejectedValue(new Error("lookup failed"));

    await expect(getPublicKey("missing-key")).rejects.toThrow("lookup failed");
    await expect(getPublicKey("missing-key")).rejects.toBeInstanceOf(
      ExtBridgeError,
    );
    expect(axiosMock).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(60_001);

    await expect(getPublicKey("missing-key")).rejects.toThrow("lookup failed");
    expect(axiosMock).toHaveBeenCalledTimes(2);
  });

  it("caches an invalid response as a failed lookup", async () => {
    axiosMock.mockResolvedValue({ data: {} });

    await expect(getPublicKey("invalid-response")).rejects.toBeInstanceOf(
      ExtBridgeError,
    );
    await expect(getPublicKey("invalid-response")).rejects.toBeInstanceOf(
      ExtBridgeError,
    );
    expect(axiosMock).toHaveBeenCalledTimes(1);
  });

  it("returns and caches a valid public key", async () => {
    const serial = "valid-key";
    axiosMock.mockResolvedValue({
      data: { key: publicKeyPem, algorithm: "EdDSA", serial },
    });

    const first = await getPublicKey(serial);
    const second = await getPublicKey(serial);

    expect(first).toBeInstanceOf(CryptoKey);
    expect(second).toBe(first);
    expect(axiosMock).toHaveBeenCalledTimes(1);
  });
});
