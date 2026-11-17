import { afterEach, expect, test, vi } from "vitest";
import { connectHostRenderRoot } from "@/connection/connectHostRenderRoot";
import { HostOriginThread } from "@/connection/originThreads";
import { Version } from "@/connection/types";

const parentWindow = () => ({ postMessage: vi.fn() }) as unknown as Window;

const setAncestorOrigins = (origins: string[]) => {
  const descriptor = Object.getOwnPropertyDescriptor(
    window.location,
    "ancestorOrigins",
  );
  Object.defineProperty(window.location, "ancestorOrigins", {
    configurable: true,
    value: origins,
  });

  return () => {
    if (descriptor) {
      Object.defineProperty(window.location, "ancestorOrigins", descriptor);
    } else {
      Reflect.deleteProperty(window.location, "ancestorOrigins");
    }
  };
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

test("reports communication version 6 to the host", async () => {
  const parent = parentWindow();
  vi.stubGlobal("parent", parent);
  const call = vi
    .spyOn(HostOriginThread.prototype, "call")
    .mockResolvedValue(undefined);

  const connection = await connectHostRenderRoot({
    root: document.createElement("div"),
    packageVersion: "1.2.3",
  });

  expect(call.mock.calls[0]?.[1]).toStrictEqual([
    { version: Version.v6, packageVersion: "1.2.3" },
  ]);
  connection.close();
});

test("rejects a host origin outside the allowed origins", async () => {
  const restoreAncestorOrigins = setAncestorOrigins(["https://other.example"]);

  try {
    await expect(
      connectHostRenderRoot({ root: document.createElement("div") }),
    ).rejects.toThrow("Host origin is not allowed");
  } finally {
    restoreAncestorOrigins();
  }
});
