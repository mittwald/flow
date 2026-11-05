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

const axiosMock = vi.hoisted(() =>
  Object.assign(vi.fn(), {
    isAxiosError: (error: unknown) =>
      typeof error === "object" &&
      error !== null &&
      (error as { isAxiosError?: boolean }).isAxiosError === true,
  }),
);

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
  it.each([".", "..", "../other", "a?b=c", "a/b", "latest", "a".repeat(129)])(
    "rejects the invalid serial %s without requesting it",
    async (serial) => {
      await expect(getPublicKey(serial)).rejects.toBeInstanceOf(ExtBridgeError);
      expect(axiosMock).not.toHaveBeenCalled();
    },
  );

  it("accepts an uppercase UUID and uses it unchanged in the path", async () => {
    const serial = "9A5AEB8D-0081-4ADB-88AD-BDFC6ED1D94E";
    axiosMock.mockResolvedValue({
      data: { key: publicKeyPem, algorithm: "EdDSA", serial },
    });

    await getPublicKey(serial);

    expect(axiosMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `${MW_EXT_API_URL}/v2/public-keys/${serial}`,
      }),
    );
  });

  it("caches 404 responses for 60 seconds", async () => {
    const serial = "9a5aeb8d-0081-4adb-88ad-bdfc6ed1d94f";
    const lookupError = Object.assign(new Error("Not found"), {
      isAxiosError: true,
      response: { status: 404 },
    });
    axiosMock.mockRejectedValue(lookupError);

    const firstError = await getPublicKey(serial).catch(
      (error: unknown) => error,
    );
    expect(firstError).toBeInstanceOf(ExtBridgeError);
    expect((firstError as ExtBridgeError).cause).toBe(lookupError);

    await expect(getPublicKey(serial)).rejects.toThrow(
      "Public key lookup for this serial failed recently",
    );
    expect(axiosMock).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(60_000);

    await expect(getPublicKey(serial)).rejects.toBeInstanceOf(ExtBridgeError);
    expect(axiosMock).toHaveBeenCalledTimes(2);
  });

  it.each([
    {
      name: "a network error",
      serial: "9a5aeb8d-0081-4adb-88ad-bdfc6ed1d950",
      response: undefined,
    },
    {
      name: "a 503 response",
      serial: "9a5aeb8d-0081-4adb-88ad-bdfc6ed1d951",
      response: { status: 503 },
    },
  ])("does not cache $name", async ({ serial, response }) => {
    const lookupError = Object.assign(new Error("Transient failure"), {
      isAxiosError: true,
      ...(response === undefined ? {} : { response }),
    });
    axiosMock.mockRejectedValue(lookupError);

    const firstError = await getPublicKey(serial).catch(
      (error: unknown) => error,
    );
    expect(firstError).toBeInstanceOf(ExtBridgeError);
    expect((firstError as ExtBridgeError).cause).toBe(lookupError);

    await expect(getPublicKey(serial)).rejects.toBeInstanceOf(ExtBridgeError);
    expect(axiosMock).toHaveBeenCalledTimes(2);
  });

  it("caches an invalid response as a failed lookup", async () => {
    const serial = "9a5aeb8d-0081-4adb-88ad-bdfc6ed1d952";
    axiosMock.mockResolvedValue({ data: {} });

    await expect(getPublicKey(serial)).rejects.toBeInstanceOf(ExtBridgeError);
    await expect(getPublicKey(serial)).rejects.toBeInstanceOf(ExtBridgeError);
    expect(axiosMock).toHaveBeenCalledTimes(1);
  });

  it("caches a public key import failure", async () => {
    const serial = "9a5aeb8d-0081-4adb-88ad-bdfc6ed1d953";
    axiosMock.mockResolvedValue({
      data: {
        key: "-----BEGIN PUBLIC KEY-----\nnot a key\n-----END PUBLIC KEY-----",
        algorithm: "EdDSA",
        serial,
      },
    });

    await expect(getPublicKey(serial)).rejects.toBeInstanceOf(ExtBridgeError);
    await expect(getPublicKey(serial)).rejects.toBeInstanceOf(ExtBridgeError);
    expect(axiosMock).toHaveBeenCalledTimes(1);
  });

  it("returns and caches a valid public key", async () => {
    const serial = "9a5aeb8d-0081-4adb-88ad-bdfc6ed1d954";
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
