import plugin from "./viteI18nPlugin";
import { expect } from "@jest/globals";
import path from "path";
import type {
  PartialResolvedId,
  PluginContext,
  TransformPluginContext,
  SourceDescription,
} from "rollup";

describe("vite i18n plugin", () => {
  it("resolve will return correct id", async () => {
    if (plugin.resolveId && typeof plugin.resolveId === "function") {
      const resolve = (await plugin.resolveId.apply({} as PluginContext, [
        "./locales/*.locale.json",
        "./foo/foo.ts",
        {
          isEntry: false,
          attributes: {},
        },
      ])) as PartialResolvedId;

      expect(resolve).toBeDefined();
      expect(typeof resolve).toBe("object");
      expect(resolve.id.startsWith("\x00.locale.json@")).toBeTruthy();
      expect(resolve.id.endsWith("/foo/locales/*.locale.json")).toBeTruthy();
    }
  });

  it("resolve will return nothing when importer is not known", async () => {
    if (plugin.resolveId && typeof plugin.resolveId === "function") {
      const resolve = (await plugin.resolveId.apply({} as PluginContext, [
        "./locales/*.locale.json",
        "",
        {
          isEntry: false,
          attributes: {},
        },
      ])) as PartialResolvedId;

      expect(resolve).toBeUndefined();
    }
  });

  it("test multi intl files will be generated", () => {
    if (plugin.load && typeof plugin.load === "function") {
      const load = plugin.load.apply({} as PluginContext, [
        path.join(__dirname, "test", "locales", "*.locale.json"),
      ]) as SourceDescription;

      expect(JSON.parse(load.code)).toMatchObject({
        bar: { bar: "baz" },
        foo: { foo: "bar" },
      });
    }
  });

  it("test single intl files will be generated", () => {
    if (plugin.load && typeof plugin.load === "function") {
      const load = plugin.load.apply({} as PluginContext, [
        path.join(__dirname, "test", "locales", "bar.locale.json"),
      ]) as SourceDescription;

      expect(JSON.parse(load.code)).toMatchObject({
        bar: { bar: "baz" },
      });
    }
  });

  it("test multi intl files will be transformed", () => {
    if (plugin.transform && typeof plugin.transform === "function") {
      const transform = plugin.transform.apply({} as TransformPluginContext, [
        "",
        path.join(__dirname, "test", "locales", "*.locale.json"),
      ]) as SourceDescription;

      expect(JSON.parse(transform.code)).toMatchObject({
        bar: { bar: "baz" },
        foo: { foo: "bar" },
      });
    }
  });

  it("test single intl files will be transformed", () => {
    if (plugin.load && typeof plugin.load === "function") {
      const load = plugin.load.apply({} as PluginContext, [
        path.join(__dirname, "test", "locales", "bar.locale.json"),
      ]) as SourceDescription;

      expect(JSON.parse(load.code)).toMatchObject({
        bar: { bar: "baz" },
      });
    }
  });
});
