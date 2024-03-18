import plugin, { moduleId } from "./viteI18nPlugin";
import { test, describe, expect, vi } from "vitest";
import type {
  PartialResolvedId,
  PluginContext,
  SourceDescription,
} from "rollup";
import path from "path";
import { HmrContext, ViteDevServer } from "vite";
import { URL } from "url";

const __dirname = new URL(".", import.meta.url).pathname;

describe.skip("vite i18n plugin", () => {
  test("resolve will return correct id", async () => {
    expect(plugin.resolveId).toBeDefined();
    expect(typeof plugin.resolveId).toBe("function");

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
      expect(
        resolve.id.endsWith("1a1e1818b63c26ce9b92f94ec4c972dd"),
      ).toBeTruthy();
    }
  });

  test("resolve will return nothing when importer is not known", async () => {
    expect(plugin.resolveId).toBeDefined();
    expect(typeof plugin.resolveId).toBe("function");

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

  test("test multi intl files will be generated", () => {
    expect(plugin.load).toBeDefined();
    expect(typeof plugin.load).toBe("function");

    if (plugin.load && typeof plugin.load === "function") {
      const load = plugin.load.apply(
        {
          getModuleInfo: () => {
            return {
              meta: {
                resolvedTranslationPath: path.join(
                  __dirname,
                  "test",
                  "locales",
                  "*.locale.json",
                ),
                requestedLanguageKey: "*",
              },
            };
          },
        } as unknown as PluginContext,
        [moduleId + "SomeFileHash"],
      ) as SourceDescription;

      expect(load).toBeDefined();
      expect(load.code).toBeDefined();
      expect(load.code).toMatchInlineSnapshot(`
        "export default {"bar":{ "bar": "baz" }
        ,"foo":{ "foo": "bar" }
        };"
      `);
    }
  });

  test("test single intl files will be generated", () => {
    expect(plugin.handleHotUpdate).toBeDefined();
    expect(typeof plugin.handleHotUpdate).toBe("function");

    if (plugin.load && typeof plugin.load === "function") {
      const load = plugin.load.apply(
        {
          getModuleInfo: () => {
            return {
              meta: {
                resolvedTranslationPath: path.join(
                  __dirname,
                  "test",
                  "locales",
                  "bar.locale.json",
                ),
                requestedLanguageKey: "bar",
              },
            };
          },
        } as unknown as PluginContext,
        [moduleId + "SomeFileHash"],
      ) as SourceDescription;

      expect(load).toBeDefined();
      expect(load.code).toBeDefined();
      expect(load.code).toMatchInlineSnapshot(`
        "export default {"bar":{ "bar": "baz" }
        };"
      `);
    }
  });

  test("test hot reload will not triggered on non locale files", () => {
    expect(plugin.handleHotUpdate).toBeDefined();
    expect(typeof plugin.handleHotUpdate).toBe("function");

    if (
      plugin.handleHotUpdate &&
      typeof plugin.handleHotUpdate === "function"
    ) {
      const hmrContext = {
        server: {
          reloadModule: vi.fn(),
          moduleGraph: {
            getModuleById: vi.fn(),
          },
        } as unknown as ViteDevServer,
        timestamp: Date.now(),
        file: "/button/button.tsx",
        read: vi.fn(),
        modules: [],
      } as HmrContext;

      plugin.handleHotUpdate.apply(this, [hmrContext]);
      expect(hmrContext.server.moduleGraph.getModuleById).toBeCalledTimes(0);
      expect(hmrContext.server.reloadModule).toBeCalledTimes(0);
    }
  });

  test("test hot reload will gets triggered for locale files", () => {
    expect(plugin.handleHotUpdate).toBeDefined();
    expect(typeof plugin.handleHotUpdate).toBe("function");

    if (
      plugin.handleHotUpdate &&
      typeof plugin.handleHotUpdate === "function"
    ) {
      const moduleMock = vi.fn().mockReturnValue("module");
      const hmrContext = {
        server: {
          reloadModule: vi.fn(),
          moduleGraph: {
            getModuleById: moduleMock,
          },
        } as unknown as ViteDevServer,
        timestamp: Date.now(),
        file: path.join(__dirname, "test", "locales", "foo.locale.json"),
        read: vi.fn(),
        modules: [],
      } as HmrContext;

      plugin.handleHotUpdate.apply(this, [hmrContext]);
      expect(hmrContext.server.moduleGraph.getModuleById).toBeCalledTimes(3);
      expect(hmrContext.server.moduleGraph.getModuleById).toBeCalledWith(
        `${moduleId}b20c85a80a5c361dbb4a0afdb0674ef1`,
      );
      expect(hmrContext.server.moduleGraph.getModuleById).toBeCalledWith(
        `${moduleId}8548eb70fa2e0577ba1853e18a3a8d29`,
      );
      expect(hmrContext.server.moduleGraph.getModuleById).toBeCalledWith(
        `${moduleId}c792203dcbe4dbc5e33cf1ca0446134d`,
      );

      expect(hmrContext.server.reloadModule).toBeCalledTimes(3);
      expect(hmrContext.server.reloadModule).toBeCalledWith("module");
    }
  });
});
