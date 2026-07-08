import postcss, { type Container, type Rule } from "postcss";
import { describe, test, expect } from "vitest";
import {
  flowComponentsLayerPostcssPlugin,
  flowLayerOrderPlugin,
} from "./flowCssLayerPlugin";

const layerOrder =
  "@layer flow.reset, flow.base, flow.components, flow.components-override;\n";

const processCss = async (input: string, from: string) => {
  const result = await postcss([flowComponentsLayerPostcssPlugin()]).process(
    input,
    { from },
  );

  return result.css;
};

const enclosingLayerForSelector = (css: string, selectorSubstring: string) => {
  const root = postcss.parse(css);
  let layer: string | null | undefined;

  root.walkRules((rule) => {
    if (layer !== undefined || !rule.selector.includes(selectorSubstring)) {
      return;
    }

    let parent: Container | undefined = (rule as Rule).parent;
    while (parent) {
      if (parent.type === "atrule" && parent.name === "layer") {
        layer = parent.params;
        return;
      }
      parent = parent.parent;
    }

    layer = null;
  });

  return layer ?? null;
};

interface Asset {
  type: "asset";
  fileName: string;
  source: string;
}

interface Chunk {
  type: "chunk";
  fileName: string;
  code: string;
}

type Bundle = Record<string, Asset | Chunk>;

const runGenerateBundle = (bundle: Bundle) => {
  const plugin = flowLayerOrderPlugin();
  const hook = plugin.generateBundle as (
    options: unknown,
    bundle: Record<string, unknown>,
  ) => void;

  hook({}, bundle);
};

describe("flow components layer postcss plugin", () => {
  test("is a postcss plugin factory", () => {
    expect(flowComponentsLayerPostcssPlugin.postcss).toBe(true);
  });

  test("wraps module rules", async () => {
    const css = await processCss(
      ".flow--button { color: red; }",
      "/x/Button.module.scss",
    );

    expect(enclosingLayerForSelector(css, ".flow--button")).toBe(
      "flow.components",
    );
  });

  test("also .module.css", async () => {
    const css = await processCss(
      ".flow--list { color: red; }",
      "/x/List.module.css",
    );

    expect(enclosingLayerForSelector(css, ".flow--list")).toBe(
      "flow.components",
    );
  });

  test("leaves flow.components-override untouched", async () => {
    const css = await processCss(
      "@layer flow.components-override { .a { z-index: 1; } }\n.b { color: red; }",
      "/x/Button.module.scss",
    );

    expect(enclosingLayerForSelector(css, ".a")).toBe(
      "flow.components-override",
    );
    expect(enclosingLayerForSelector(css, ".b")).toBe("flow.components");
  });

  test("unwraps @layer unlayered", async () => {
    const css = await processCss(
      "@layer unlayered { .cm { color: red; } }\n.b { color: blue; }",
      "/x/Button.module.scss",
    );

    expect(enclosingLayerForSelector(css, ".cm")).toBeNull();
    expect(css).not.toContain("@layer unlayered");
    expect(enclosingLayerForSelector(css, ".b")).toBe("flow.components");
  });

  test("module with only @layer unlayered", async () => {
    const css = await processCss(
      "@layer unlayered { .cm { color: red; } }",
      "/x/Button.module.scss",
    );

    expect(enclosingLayerForSelector(css, ".cm")).toBeNull();
    expect(css).not.toContain("@layer unlayered");
  });

  test("non-module file is untouched", async () => {
    const input = ".x { color: red; }";
    const css = await processCss(input, "/x/index.scss");

    expect(enclosingLayerForSelector(css, ".x")).toBeNull();
    expect(postcss.parse(css).toString()).toBe(postcss.parse(input).toString());
  });
});

describe("flow layer order vite plugin", () => {
  test("prepends after @charset", () => {
    const bundle: Bundle = {
      "css/all.css": {
        type: "asset",
        fileName: "css/all.css",
        source: '@charset "UTF-8";.a{}',
      },
    };

    runGenerateBundle(bundle);

    expect(bundle["css/all.css"].source).toBe(
      '@charset "UTF-8";' + layerOrder + ".a{}",
    );
  });

  test("prepends at start when no @charset", () => {
    const bundle: Bundle = {
      "css/all.css": {
        type: "asset",
        fileName: "css/all.css",
        source: ".a{}",
      },
    };

    runGenerateBundle(bundle);

    expect(bundle["css/all.css"].source).toBe(layerOrder + ".a{}");
  });

  test("also handles globals.css", () => {
    const bundle: Bundle = {
      "css/globals.css": {
        type: "asset",
        fileName: "css/globals.css",
        source: ".a{}",
      },
    };

    runGenerateBundle(bundle);

    expect(bundle["css/globals.css"].source).toBe(layerOrder + ".a{}");
  });

  test("is idempotent", () => {
    const bundle: Bundle = {
      "css/all.css": {
        type: "asset",
        fileName: "css/all.css",
        source: layerOrder + ".a{}",
      },
    };

    runGenerateBundle(bundle);
    runGenerateBundle(bundle);

    expect(bundle["css/all.css"].source).toBe(layerOrder + ".a{}");
  });

  test("ignores non-target assets", () => {
    const bundle: Bundle = {
      "js/default.mjs": {
        type: "chunk",
        fileName: "js/default.mjs",
        code: "export {};",
      },
      "css/other.css": {
        type: "asset",
        fileName: "css/other.css",
        source: ".other{}",
      },
      "css/all.css": {
        type: "asset",
        fileName: "css/all.css",
        source: ".a{}",
      },
    };

    runGenerateBundle(bundle);

    expect(bundle["js/default.mjs"].code).toBe("export {};");
    expect(bundle["css/other.css"].source).toBe(".other{}");
    expect(bundle["css/all.css"].source).toBe(layerOrder + ".a{}");
  });
});
