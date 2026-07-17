import path from "node:path";
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";
import defaultConfig from "../../vite.config";

// FLOW_CROSS_VERSION selects workspace source for the reference pass or an
// installed old package for a comparison pass.
const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "../..");
const version = process.env.FLOW_CROSS_VERSION ?? "current";
const isCurrent = version === "current";

const oldPkg = path.join(
  packageRoot,
  `node_modules/.cross-version/${version}/node_modules/@mittwald/flow-remote-react-components`,
);

const packageAlias = isCurrent
  ? [
      {
        find: "@mittwald/flow-remote-react-components/RemoteRoot",
        replacement: path.join(packageRoot, "src/components/RemoteRoot.tsx"),
      },
      {
        find: "@mittwald/flow-remote-react-components",
        replacement: path.join(packageRoot, "src/index.ts"),
      },
    ]
  : [
      {
        find: "@mittwald/flow-remote-react-components/RemoteRoot",
        replacement: path.join(oldPkg, "dist/js/RemoteRoot.mjs"),
      },
      {
        find: "@mittwald/flow-remote-react-components",
        replacement: path.join(oldPkg, "dist/js/index.mjs"),
      },
    ];

export default mergeConfig(defaultConfig, {
  define: {
    __CROSS_VERSION_REF_DIR__: JSON.stringify(path.join(here, ".refs")),
    __FLOW_CROSS_VERSION__: JSON.stringify(version),
  },
  resolve: {
    alias: [
      {
        find: /^@\/tests\/lib\/environments$/,
        replacement: path.join(here, "environments.ts"),
      },
      ...packageAlias,
    ],
    dedupe: ["react", "react-dom"],
  },
  server: {
    fs: {
      allow: [
        packageRoot,
        path.join(packageRoot, "node_modules", ".cross-version"),
      ],
    },
  },
});
