import plugin from "./viteI18nPlugin";
import { expect } from "@jest/globals";
import path from "path";
describe("vite i18n plugin", () => {
  it("resolve will return correct id", async () => {
    if (plugin.resolveId && typeof plugin.resolveId === "function") {
      const resolve = await plugin.resolveId.apply({} as any, [
        "./intl/*.json",
        "./foo/foo.ts",
        {} as any,
      ]);

      expect(resolve).toMatchObject({
        id: "foo/intl/*.json",
      });
    }
  });

  it("resolve will return nothing when importer is not known", async () => {
    if (plugin.resolveId && typeof plugin.resolveId === "function") {
      const resolve = await plugin.resolveId.apply({} as any, [
        "./intl/*.json",
        "",
        {} as any,
      ]);

      expect(resolve).toBeUndefined();
    }
  });

  it("test intl files will be generated", () => {
    if (plugin.load && typeof plugin.load === "function") {
      const load = plugin.load.apply({} as any, [
        path.join(__dirname, "test", "intl", "*.json"),
      ]) as string;

      expect(JSON.parse(load)).toMatchObject({
        bar: { bar: "baz" },
        foo: { foo: "bar" },
      });
    }
  });

  it("test intl files will be transformed", async () => {
    if (plugin.transform && typeof plugin.transform === "function") {
      const transform = await plugin.transform.apply({} as any, [
        path.join(__dirname, "test", "intl", "*.json"),
        "",
      ]);
      expect(typeof transform).toBe("object");
      expect(JSON.parse((transform as any).code)).toMatchObject({
        bar: { bar: "baz" },
        foo: { foo: "bar" },
      });
    }
  });
});
