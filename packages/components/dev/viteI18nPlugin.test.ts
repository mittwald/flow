import plugin from "./viteI18nPlugin";
import { expect } from "@jest/globals";
import path from "path";
import type {
  PartialResolvedId,
  PluginContext,
  TransformPluginContext,
  SourceDescription,
} from "rollup";
import { HmrContext, ModuleGraph, ViteDevServer, WebSocketServer } from "vite";

describe("vite i18n plugin", () => {
  it("resolve will return correct id", async () => {
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
      expect(resolve.id.endsWith("/foo/locales/*.locale.json")).toBeTruthy();
    }
  });

  it("resolve will return nothing when importer is not known", async () => {
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

  it("test multi intl files will be generated", () => {
    expect(plugin.load).toBeDefined();
    expect(typeof plugin.load).toBe("function");

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
    expect(plugin.handleHotUpdate).toBeDefined();
    expect(typeof plugin.handleHotUpdate).toBe("function");

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
    expect(plugin.handleHotUpdate).toBeDefined();
    expect(typeof plugin.handleHotUpdate).toBe("function");

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
    expect(plugin.handleHotUpdate).toBeDefined();
    expect(typeof plugin.handleHotUpdate).toBe("function");

    if (plugin.load && typeof plugin.load === "function") {
      const load = plugin.load.apply({} as PluginContext, [
        path.join(__dirname, "test", "locales", "bar.locale.json"),
      ]) as SourceDescription;

      expect(JSON.parse(load.code)).toMatchObject({
        bar: { bar: "baz" },
      });
    }
  });

  it("test hot reload will not triggered on non locale files", () => {
    expect(plugin.handleHotUpdate).toBeDefined();
    expect(typeof plugin.handleHotUpdate).toBe("function");

    if (
      plugin.handleHotUpdate &&
      typeof plugin.handleHotUpdate === "function"
    ) {
      const hmrContext = {
        server: {
          ws: {
            send: jest.fn(),
          } as unknown as WebSocketServer,
          moduleGraph: {
            getModuleById: jest.fn(),
          } as unknown as ModuleGraph,
        } as ViteDevServer,
        timestamp: Date.now(),
        file: "/button/button.tsx",
        read: jest.fn(),
        modules: [],
      } as HmrContext;

      plugin.handleHotUpdate.apply(this, [hmrContext]);
      expect(hmrContext.server.moduleGraph.getModuleById).toBeCalledTimes(0);
      expect(hmrContext.server.ws.send).toBeCalledTimes(0);
    }
  });

  it("test hot reload will gets triggered for locale files", () => {
    expect(plugin.handleHotUpdate).toBeDefined();
    expect(typeof plugin.handleHotUpdate).toBe("function");

    if (
      plugin.handleHotUpdate &&
      typeof plugin.handleHotUpdate === "function"
    ) {
      const moduleMock = jest.fn().mockReturnValue("module");
      const hmrContext = {
        server: {
          ws: {
            send: jest.fn(),
          } as unknown as WebSocketServer,
          moduleGraph: {
            getModuleById: moduleMock,
            invalidateModule: jest.fn(),
          } as unknown as ModuleGraph,
        } as ViteDevServer,
        timestamp: Date.now(),
        file: "/button/locales/foo.locale.json",
        read: jest.fn(),
        modules: [],
      } as HmrContext;

      plugin.handleHotUpdate.apply(this, [hmrContext]);
      expect(hmrContext.server.moduleGraph.getModuleById).toBeCalledTimes(2);
      expect(hmrContext.server.moduleGraph.getModuleById).toBeCalledWith(
        "\x00.locale.json@/button/locales/*.locale.json",
      );
      expect(hmrContext.server.moduleGraph.getModuleById).toBeCalledWith(
        "\x00.locale.json@/button/locales/foo.locale.json",
      );
      expect(hmrContext.server.moduleGraph.invalidateModule).toBeCalledWith(
        "module",
      );
      expect(hmrContext.server.ws.send).toBeCalledTimes(1);
    }
  });
});
