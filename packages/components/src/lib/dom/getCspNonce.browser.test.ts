import { afterEach, describe, expect, test } from "vitest";
import { getCspNonce } from "./getCspNonce";

const metas: HTMLMetaElement[] = [];

const addCspNonceMeta = (attributes: Record<string, string>) => {
  const meta = document.createElement("meta");
  meta.setAttribute("property", "csp-nonce");
  for (const [name, value] of Object.entries(attributes)) {
    meta.setAttribute(name, value);
  }
  document.head.append(meta);
  metas.push(meta);
};

afterEach(() => {
  for (const meta of metas) {
    meta.remove();
  }
  metas.length = 0;
});

describe("getCspNonce", () => {
  test("returns the nonce of the csp-nonce meta", () => {
    addCspNonceMeta({ nonce: "from-nonce" });
    expect(getCspNonce()).toBe("from-nonce");
  });

  test("falls back to the content of the csp-nonce meta", () => {
    addCspNonceMeta({ content: "from-content" });
    expect(getCspNonce()).toBe("from-content");
  });

  test("returns undefined without a csp-nonce meta", () => {
    expect(getCspNonce()).toBeUndefined();
  });
});
