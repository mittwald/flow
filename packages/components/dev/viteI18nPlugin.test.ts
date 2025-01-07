import plugin, { generateVirtualFileId, moduleId } from "./viteI18nPlugin";
import { test, describe, expect, vi } from "vitest";
import type {
  PartialResolvedId,
  PluginContext,
  SourceDescription,
} from "rollup";
import path from "path";
import type { HmrContext, ViteDevServer } from "vite";

describe("vite i18n plugin", () => {
  test("resolve will return correct id", async () => {
    expect(plugin.resolveId).toBeDefined();
    expect(typeof plugin.resolveId).toBe("function");

    if (plugin.resolveId && typeof plugin.resolveId === "function") {
      const resolve = (await plugin.resolveId.apply({} as PluginContext, [
        "./locales/*.locale.json",
        "./foo.ts",
        {
          isEntry: false,
          attributes: {},
        },
      ])) as PartialResolvedId;

      expect(resolve).toBeDefined();
      expect(typeof resolve).toBe("object");
      expect(resolve.id).toMatch(
        generateVirtualFileId("./locales/*.locale.json"),
      );
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
      expect(load.code).toMatch(
        'export default {"bar": {  "bar": (args) => `test with variable ${args.var}`,\n' +
          '  "bar.simple": `test simple variable`,\n' +
          '},"foo": {  "foo": (args) => `bar ${args.var}`,\n' +
          '  "foo.simple": `test simple variable`,\n' +
          "}};",
      );
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
      expect(load.code).toMatch(
        'export default {"bar": {  "bar": (args) => `test with variable ${args.var}`,\n' +
          '  "bar.simple": `test simple variable`,\n' +
          "}};",
      );
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
        generateVirtualFileId("./dev/test/locales/*.locale.json"),
      );
      expect(hmrContext.server.moduleGraph.getModuleById).toBeCalledWith(
        generateVirtualFileId("./dev/test/locales/foo.locale.json"),
      );
      expect(hmrContext.server.moduleGraph.getModuleById).toBeCalledWith(
        generateVirtualFileId("./dev/test/locales/bar.locale.json"),
      );

      expect(hmrContext.server.reloadModule).toBeCalledTimes(3);
      expect(hmrContext.server.reloadModule).toBeCalledWith("module");
    }
  });
});
