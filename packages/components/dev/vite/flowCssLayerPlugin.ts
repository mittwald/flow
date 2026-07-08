import type { Plugin } from "vite";
import type { Plugin as PostcssPlugin, Root } from "postcss";
import { atRule } from "postcss";

const LAYER_ORDER =
  "@layer flow.reset, flow.base, flow.components, flow.components-override;\n";

type PostcssPluginFactory = (() => PostcssPlugin) & { postcss: true };

export const flowComponentsLayerPostcssPlugin: PostcssPluginFactory =
  Object.assign(
    (): PostcssPlugin => ({
      postcssPlugin: "flow-components-layer",
      Once(root: Root, { result }) {
        const from = result.opts.from ?? root.source?.input.file ?? "";
        if (!from.includes(".module.scss") && !from.includes(".module.css")) {
          return;
        }

        // Wrap every top-level rule that is not already inside an `@layer`
        // into `@layer flow.components`. Existing `@layer` at-rules (including
        // the `unlayered` sentinel handled below) are left out of the wrap.
        const nodes = root.nodes?.filter(
          (node) => node.type !== "atrule" || node.name !== "layer",
        );
        if (nodes && nodes.length > 0) {
          const layer = atRule({ name: "layer", params: "flow.components" });
          root.insertBefore(nodes[0], layer);
          nodes.forEach((node) => {
            node.remove();
            layer.append(node);
          });
        }

        // Unwrap the `@layer unlayered { … }` sentinel: hoist its rules back to
        // the top level so they emit with NO `@layer`. Truly-unlayered CSS is
        // the only way to override third-party CSS injected unlayered at
        // runtime (CodeMirror, react-easy-crop, …) — any layer loses to it.
        root.nodes
          ?.filter(
            (node) =>
              node.type === "atrule" &&
              node.name === "layer" &&
              node.params.trim() === "unlayered",
          )
          .forEach((node) => {
            const children = node.nodes ? [...node.nodes] : [];
            children.forEach((child) => root.insertBefore(node, child));
            node.remove();
          });
      },
    }),
    { postcss: true as const },
  );

export const flowLayerOrderPlugin = (): Plugin => ({
  name: "flow-layer-order",
  // `post` so this runs after Vite's CSS finalization (minify + `@charset`
  // injection); otherwise the prepend is clobbered when the asset is re-emitted.
  enforce: "post",
  generateBundle(_options, bundle) {
    for (const file of Object.values(bundle)) {
      if (
        file.type !== "asset" ||
        !(
          file.fileName.endsWith("all.css") ||
          file.fileName.endsWith("globals.css")
        )
      ) {
        continue;
      }
      const source = String(file.source);
      // `@charset` must remain the very first rule, so the layer order goes
      // right after it when present.
      const charset = source.match(/^@charset [^;]+;/);
      const head = charset ? charset[0] : "";
      const body = charset ? source.slice(charset[0].length) : source;
      if (body.startsWith("@layer flow.reset")) {
        continue;
      }
      file.source = head + LAYER_ORDER + body;
    }
  },
});
