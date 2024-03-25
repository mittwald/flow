var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// dev/dirname.cjs
var require_dirname = __commonJS({
  "dev/dirname.cjs"(exports, module) {
    "use strict";
    var __vite_injected_original_dirname2 = "/Users/lmeyer/Entwicklung/Frontend/new/flow/packages/components/dev";
    module.exports = __vite_injected_original_dirname2;
  }
});

// vite.build.config.ts
import { defineConfig as defineConfig2, mergeConfig } from "file:///Users/lmeyer/Entwicklung/Frontend/new/flow/.yarn/__virtual__/vite-virtual-5dfcae5c93/0/cache/vite-npm-5.2.2-55cf705550-472c6a1d41.zip/node_modules/vite/dist/node/index.js";
import banner from "file:///Users/lmeyer/Entwicklung/Frontend/new/flow/.yarn/cache/vite-plugin-banner-npm-0.7.1-d34e69a97b-b638585503.zip/node_modules/vite-plugin-banner/dist/index.mjs";
import dts from "file:///Users/lmeyer/Entwicklung/Frontend/new/flow/.yarn/__virtual__/vite-plugin-dts-virtual-0bc7cf90af/0/cache/vite-plugin-dts-npm-3.7.3-1ceef757c1-da16b971d5.zip/node_modules/vite-plugin-dts/dist/index.mjs";

// vite.config.ts
import { defineConfig } from "file:///Users/lmeyer/Entwicklung/Frontend/new/flow/.yarn/__virtual__/vite-virtual-5dfcae5c93/0/cache/vite-npm-5.2.2-55cf705550-472c6a1d41.zip/node_modules/vite/dist/node/index.js";
import postcssNesting from "file:///Users/lmeyer/Entwicklung/Frontend/new/flow/.yarn/__virtual__/postcss-nesting-virtual-f05134391e/0/cache/postcss-nesting-npm-12.1.0-a03de91cfa-8790272321.zip/node_modules/postcss-nesting/dist/index.mjs";

// dev/cssModuleClassNameGenerator.ts
var _dirname = __toESM(require_dirname(), 1);
import { dirname } from "path";
import decamelize from "file:///Users/lmeyer/Entwicklung/Frontend/new/flow/.yarn/cache/decamelize-npm-6.0.0-109b08ac0a-689888f5ea.zip/node_modules/decamelize/index.js";
var parentDir = dirname(_dirname.default);
var cssModuleClassNameGenerator = (name, filename) => {
  name = decamelize(name, { separator: "-" });
  if (name === "flow") {
    return name;
  }
  const relativeFilename = filename.startsWith(parentDir) ? filename.slice(parentDir.length) : filename;
  if (!/.*\.module\.s?css/.test(relativeFilename)) {
    return name;
  }
  const parts = Array.from(
    relativeFilename.matchAll(/(components\/(.+?)\/)/g)
  ).map((p) => decamelize(p[2], { separator: "-" }).toLowerCase());
  if (parts.length > 0) {
    const lastPart = parts[parts.length - 1];
    if (lastPart !== name) {
      parts.push(name);
    }
    return "flow--" + parts.join("--");
  }
  return name;
};

// vite.config.ts
import path2 from "path";

// dev/viteI18nPlugin.ts
import path from "path";
import * as fs from "fs";
import crypt from "crypto";
var moduleSuffix = ".locale.json";
var moduleId = `\0${moduleSuffix}@`;
var localeDirectory = "locales";
var importPathInfosRegEx = new RegExp(
  `^(.+/${localeDirectory})/((.+)${moduleSuffix.replaceAll(".", "\\.")})$`
);
var generateComponentIntlContent = (filePath, languageKey) => {
  const langObject = [];
  if (languageKey === "*") {
    const fileDirectory = path.dirname(filePath);
    fs.readdirSync(fileDirectory).forEach((file) => {
      const filePath2 = path.join(fileDirectory, file);
      const match = filePath2.match(importPathInfosRegEx);
      const fileContent = fs.readFileSync(filePath2, "utf8");
      langObject.push(`"${match && match[3]}":${fileContent}`);
    });
  } else {
    const fileContent = fs.readFileSync(filePath, "utf8");
    langObject.push(`"${languageKey}":${fileContent}`);
  }
  return `{${langObject.join(",")}}`;
};
var viteI18nPlugin_default = {
  name: "handle-i18n-import",
  enforce: "pre",
  handleHotUpdate: async ({ file, server }) => {
    const localeMatch = file.match(importPathInfosRegEx);
    if (localeMatch) {
      const localDirectory = path.dirname(file);
      fs.readdirSync(localDirectory).concat([`*${moduleSuffix}`]).forEach((file2) => {
        const filePath = path.join(localDirectory, file2);
        const virtualFileId = crypt.createHash("md5").update(filePath).digest("hex");
        const id = `${moduleId}${virtualFileId}`;
        const module = server.moduleGraph.getModuleById(id);
        if (module) {
          server.reloadModule(module);
        }
      });
    }
  },
  async resolveId(id, importer) {
    const match = id.match(importPathInfosRegEx);
    if (match && importer) {
      const importerDirectory = path.dirname(importer);
      const resolvedTranslationPath = path.resolve(importerDirectory, id);
      const virtualFileId = crypt.createHash("md5").update(resolvedTranslationPath).digest("hex");
      return {
        id: moduleId + virtualFileId,
        shouldTransformCachedModule: true,
        meta: {
          id,
          importer,
          importerDirectory,
          resolvedTranslationPath,
          requestedLanguageKey: match[3]
        }
      };
    }
  },
  load(id) {
    if (id.startsWith(moduleId)) {
      const virtualFileModule = this.getModuleInfo(id);
      if (virtualFileModule && virtualFileModule.meta) {
        const meta = virtualFileModule.meta;
        const code = generateComponentIntlContent(
          meta.resolvedTranslationPath,
          meta.requestedLanguageKey
        );
        return {
          code: `export default ${code};`,
          map: null
        };
      }
    }
  }
};

// vite.config.ts
var __vite_injected_original_dirname = "/Users/lmeyer/Entwicklung/Frontend/new/flow/packages/components";
var vite_config_default = defineConfig({
  assetsInclude: ["/sb-preview/runtime.js"],
  plugins: [viteI18nPlugin_default],
  resolve: {
    alias: [
      {
        find: /@\//,
        replacement: path2.resolve(__vite_injected_original_dirname) + "/src/"
      }
    ]
  },
  css: {
    postcss: {
      plugins: [postcssNesting]
    },
    modules: {
      generateScopedName: cssModuleClassNameGenerator
    }
  }
});

// vite.build.config.ts
import { externalizeDeps } from "file:///Users/lmeyer/Entwicklung/Frontend/new/flow/.yarn/__virtual__/vite-plugin-externalize-deps-virtual-f2051659cc/0/cache/vite-plugin-externalize-deps-npm-0.8.0-e8f6177f06-0ed0d2a85f.zip/node_modules/vite-plugin-externalize-deps/dist/index.js";
var vite_build_config_default = defineConfig2(
  mergeConfig(vite_config_default, {
    plugins: [
      banner(
        (filename) => filename.endsWith(".js") ? '"use client"\r\n/* */' : ""
      ),
      externalizeDeps(),
      dts({
        include: ["src"],
        outDir: "dist/types"
      })
    ],
    build: {
      lib: {
        entry: {
          Avatar: "./src/components/Avatar/index.ts",
          Button: "./src/components/Button/index.ts",
          ButtonGroup: "./src/components/ButtonGroup/index.ts",
          Checkbox: "./src/components/Checkbox/index.ts",
          ColumnLayout: "./src/components/ColumnLayout/index.ts",
          Content: "./src/components/Content/index.ts",
          CopyButton: "./src/components/CopyButton/index.ts",
          FieldDescription: "./src/components/FieldDescription/index.ts",
          FieldError: "./src/components/FieldError/index.ts",
          Header: "./src/components/Header/index.ts",
          Heading: "./src/components/Heading/index.ts",
          Icon: "./src/components/Icon/index.ts",
          Icons: "./src/components/Icon/components/icons/index.ts",
          Image: "./src/components/Image/index.ts",
          Initials: "./src/components/Initials/index.ts",
          InlineAlert: "./src/components/InlineAlert/index.ts",
          InlineCode: "./src/components/InlineCode/index.ts",
          Label: "./src/components/Label/index.ts",
          LabeledValue: "./src/components/LabeledValue/index.ts",
          LayoutCard: "./src/components/LayoutCard/index.ts",
          Link: "./src/components/Link/index.ts",
          List: "./src/components/List/index.ts",
          "List/ListLoaderAsyncResource": "./src/components/List/components/ListLoaderAsyncResource.ts",
          Modal: "./src/components/Modal/index.ts",
          Navigation: "./src/components/Navigation/index.ts",
          NumberField: "./src/components/NumberField/index.ts",
          RadioGroup: "./src/components/RadioGroup/index.ts",
          Section: "./src/components/Section/index.ts",
          StatusBadge: "./src/components/StatusBadge/index.ts",
          StatusIcon: "./src/components/StatusIcon/index.ts",
          Switch: "./src/components/Switch/index.ts",
          Text: "./src/components/Text/index.ts",
          TextArea: "./src/components/TextArea/index.ts",
          TextField: "./src/components/TextField/index.ts",
          Tooltip: "./src/components/Tooltip/index.ts",
          stylesInit: "./src/styles/index.ts",
          "nextjs/LinkProvider": "./src/components/nextjs/LinkProvider/index.ts"
        },
        formats: ["es"]
      },
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === "style.css") {
              return "styles.css";
            }
            return assetInfo.name;
          }
        }
      }
    }
  })
);
export {
  vite_build_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZGV2L2Rpcm5hbWUuY2pzIiwgInZpdGUuYnVpbGQuY29uZmlnLnRzIiwgInZpdGUuY29uZmlnLnRzIiwgImRldi9jc3NNb2R1bGVDbGFzc05hbWVHZW5lcmF0b3IudHMiLCAiZGV2L3ZpdGVJMThuUGx1Z2luLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2xtZXllci9FbnR3aWNrbHVuZy9Gcm9udGVuZC9uZXcvZmxvdy9wYWNrYWdlcy9jb21wb25lbnRzL2RldlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2xtZXllci9FbnR3aWNrbHVuZy9Gcm9udGVuZC9uZXcvZmxvdy9wYWNrYWdlcy9jb21wb25lbnRzL2Rldi9kaXJuYW1lLmNqc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbG1leWVyL0VudHdpY2tsdW5nL0Zyb250ZW5kL25ldy9mbG93L3BhY2thZ2VzL2NvbXBvbmVudHMvZGV2L2Rpcm5hbWUuY2pzXCI7bW9kdWxlLmV4cG9ydHMgPSBfX2Rpcm5hbWU7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9sbWV5ZXIvRW50d2lja2x1bmcvRnJvbnRlbmQvbmV3L2Zsb3cvcGFja2FnZXMvY29tcG9uZW50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2xtZXllci9FbnR3aWNrbHVuZy9Gcm9udGVuZC9uZXcvZmxvdy9wYWNrYWdlcy9jb21wb25lbnRzL3ZpdGUuYnVpbGQuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9sbWV5ZXIvRW50d2lja2x1bmcvRnJvbnRlbmQvbmV3L2Zsb3cvcGFja2FnZXMvY29tcG9uZW50cy92aXRlLmJ1aWxkLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZywgbWVyZ2VDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IGJhbm5lciBmcm9tIFwidml0ZS1wbHVnaW4tYmFubmVyXCI7XG5pbXBvcnQgZHRzIGZyb20gXCJ2aXRlLXBsdWdpbi1kdHNcIjtcbmltcG9ydCBiYXNlQ29uZmlnIGZyb20gXCIuL3ZpdGUuY29uZmlnXCI7XG5pbXBvcnQgeyBleHRlcm5hbGl6ZURlcHMgfSBmcm9tIFwidml0ZS1wbHVnaW4tZXh0ZXJuYWxpemUtZGVwc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoXG4gIG1lcmdlQ29uZmlnKGJhc2VDb25maWcsIHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICBiYW5uZXIoKGZpbGVuYW1lKSA9PlxuICAgICAgICBmaWxlbmFtZS5lbmRzV2l0aChcIi5qc1wiKSA/ICdcInVzZSBjbGllbnRcIlxcclxcbi8qICovJyA6IFwiXCIsXG4gICAgICApLFxuICAgICAgZXh0ZXJuYWxpemVEZXBzKCksXG4gICAgICBkdHMoe1xuICAgICAgICBpbmNsdWRlOiBbXCJzcmNcIl0sXG4gICAgICAgIG91dERpcjogXCJkaXN0L3R5cGVzXCIsXG4gICAgICB9KSxcbiAgICBdLFxuICAgIGJ1aWxkOiB7XG4gICAgICBsaWI6IHtcbiAgICAgICAgZW50cnk6IHtcbiAgICAgICAgICBBdmF0YXI6IFwiLi9zcmMvY29tcG9uZW50cy9BdmF0YXIvaW5kZXgudHNcIixcbiAgICAgICAgICBCdXR0b246IFwiLi9zcmMvY29tcG9uZW50cy9CdXR0b24vaW5kZXgudHNcIixcbiAgICAgICAgICBCdXR0b25Hcm91cDogXCIuL3NyYy9jb21wb25lbnRzL0J1dHRvbkdyb3VwL2luZGV4LnRzXCIsXG4gICAgICAgICAgQ2hlY2tib3g6IFwiLi9zcmMvY29tcG9uZW50cy9DaGVja2JveC9pbmRleC50c1wiLFxuICAgICAgICAgIENvbHVtbkxheW91dDogXCIuL3NyYy9jb21wb25lbnRzL0NvbHVtbkxheW91dC9pbmRleC50c1wiLFxuICAgICAgICAgIENvbnRlbnQ6IFwiLi9zcmMvY29tcG9uZW50cy9Db250ZW50L2luZGV4LnRzXCIsXG4gICAgICAgICAgQ29weUJ1dHRvbjogXCIuL3NyYy9jb21wb25lbnRzL0NvcHlCdXR0b24vaW5kZXgudHNcIixcbiAgICAgICAgICBGaWVsZERlc2NyaXB0aW9uOiBcIi4vc3JjL2NvbXBvbmVudHMvRmllbGREZXNjcmlwdGlvbi9pbmRleC50c1wiLFxuICAgICAgICAgIEZpZWxkRXJyb3I6IFwiLi9zcmMvY29tcG9uZW50cy9GaWVsZEVycm9yL2luZGV4LnRzXCIsXG4gICAgICAgICAgSGVhZGVyOiBcIi4vc3JjL2NvbXBvbmVudHMvSGVhZGVyL2luZGV4LnRzXCIsXG4gICAgICAgICAgSGVhZGluZzogXCIuL3NyYy9jb21wb25lbnRzL0hlYWRpbmcvaW5kZXgudHNcIixcbiAgICAgICAgICBJY29uOiBcIi4vc3JjL2NvbXBvbmVudHMvSWNvbi9pbmRleC50c1wiLFxuICAgICAgICAgIEljb25zOiBcIi4vc3JjL2NvbXBvbmVudHMvSWNvbi9jb21wb25lbnRzL2ljb25zL2luZGV4LnRzXCIsXG4gICAgICAgICAgSW1hZ2U6IFwiLi9zcmMvY29tcG9uZW50cy9JbWFnZS9pbmRleC50c1wiLFxuICAgICAgICAgIEluaXRpYWxzOiBcIi4vc3JjL2NvbXBvbmVudHMvSW5pdGlhbHMvaW5kZXgudHNcIixcbiAgICAgICAgICBJbmxpbmVBbGVydDogXCIuL3NyYy9jb21wb25lbnRzL0lubGluZUFsZXJ0L2luZGV4LnRzXCIsXG4gICAgICAgICAgSW5saW5lQ29kZTogXCIuL3NyYy9jb21wb25lbnRzL0lubGluZUNvZGUvaW5kZXgudHNcIixcbiAgICAgICAgICBMYWJlbDogXCIuL3NyYy9jb21wb25lbnRzL0xhYmVsL2luZGV4LnRzXCIsXG4gICAgICAgICAgTGFiZWxlZFZhbHVlOiBcIi4vc3JjL2NvbXBvbmVudHMvTGFiZWxlZFZhbHVlL2luZGV4LnRzXCIsXG4gICAgICAgICAgTGF5b3V0Q2FyZDogXCIuL3NyYy9jb21wb25lbnRzL0xheW91dENhcmQvaW5kZXgudHNcIixcbiAgICAgICAgICBMaW5rOiBcIi4vc3JjL2NvbXBvbmVudHMvTGluay9pbmRleC50c1wiLFxuICAgICAgICAgIExpc3Q6IFwiLi9zcmMvY29tcG9uZW50cy9MaXN0L2luZGV4LnRzXCIsXG4gICAgICAgICAgXCJMaXN0L0xpc3RMb2FkZXJBc3luY1Jlc291cmNlXCI6XG4gICAgICAgICAgICBcIi4vc3JjL2NvbXBvbmVudHMvTGlzdC9jb21wb25lbnRzL0xpc3RMb2FkZXJBc3luY1Jlc291cmNlLnRzXCIsXG4gICAgICAgICAgTW9kYWw6IFwiLi9zcmMvY29tcG9uZW50cy9Nb2RhbC9pbmRleC50c1wiLFxuICAgICAgICAgIE5hdmlnYXRpb246IFwiLi9zcmMvY29tcG9uZW50cy9OYXZpZ2F0aW9uL2luZGV4LnRzXCIsXG4gICAgICAgICAgTnVtYmVyRmllbGQ6IFwiLi9zcmMvY29tcG9uZW50cy9OdW1iZXJGaWVsZC9pbmRleC50c1wiLFxuICAgICAgICAgIFJhZGlvR3JvdXA6IFwiLi9zcmMvY29tcG9uZW50cy9SYWRpb0dyb3VwL2luZGV4LnRzXCIsXG4gICAgICAgICAgU2VjdGlvbjogXCIuL3NyYy9jb21wb25lbnRzL1NlY3Rpb24vaW5kZXgudHNcIixcbiAgICAgICAgICBTdGF0dXNCYWRnZTogXCIuL3NyYy9jb21wb25lbnRzL1N0YXR1c0JhZGdlL2luZGV4LnRzXCIsXG4gICAgICAgICAgU3RhdHVzSWNvbjogXCIuL3NyYy9jb21wb25lbnRzL1N0YXR1c0ljb24vaW5kZXgudHNcIixcbiAgICAgICAgICBTd2l0Y2g6IFwiLi9zcmMvY29tcG9uZW50cy9Td2l0Y2gvaW5kZXgudHNcIixcbiAgICAgICAgICBUZXh0OiBcIi4vc3JjL2NvbXBvbmVudHMvVGV4dC9pbmRleC50c1wiLFxuICAgICAgICAgIFRleHRBcmVhOiBcIi4vc3JjL2NvbXBvbmVudHMvVGV4dEFyZWEvaW5kZXgudHNcIixcbiAgICAgICAgICBUZXh0RmllbGQ6IFwiLi9zcmMvY29tcG9uZW50cy9UZXh0RmllbGQvaW5kZXgudHNcIixcbiAgICAgICAgICBUb29sdGlwOiBcIi4vc3JjL2NvbXBvbmVudHMvVG9vbHRpcC9pbmRleC50c1wiLFxuICAgICAgICAgIHN0eWxlc0luaXQ6IFwiLi9zcmMvc3R5bGVzL2luZGV4LnRzXCIsXG4gICAgICAgICAgXCJuZXh0anMvTGlua1Byb3ZpZGVyXCI6XG4gICAgICAgICAgICBcIi4vc3JjL2NvbXBvbmVudHMvbmV4dGpzL0xpbmtQcm92aWRlci9pbmRleC50c1wiLFxuICAgICAgICB9LFxuICAgICAgICBmb3JtYXRzOiBbXCJlc1wiXSxcbiAgICAgIH0sXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvOiB7IG5hbWU6IHN0cmluZyB9KSA9PiB7XG4gICAgICAgICAgICBpZiAoYXNzZXRJbmZvLm5hbWUgPT09IFwic3R5bGUuY3NzXCIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFwic3R5bGVzLmNzc1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFzc2V0SW5mby5uYW1lO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pLFxuKTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2xtZXllci9FbnR3aWNrbHVuZy9Gcm9udGVuZC9uZXcvZmxvdy9wYWNrYWdlcy9jb21wb25lbnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbG1leWVyL0VudHdpY2tsdW5nL0Zyb250ZW5kL25ldy9mbG93L3BhY2thZ2VzL2NvbXBvbmVudHMvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2xtZXllci9FbnR3aWNrbHVuZy9Gcm9udGVuZC9uZXcvZmxvdy9wYWNrYWdlcy9jb21wb25lbnRzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCBwb3N0Y3NzTmVzdGluZyBmcm9tIFwicG9zdGNzcy1uZXN0aW5nXCI7XG5pbXBvcnQgeyBjc3NNb2R1bGVDbGFzc05hbWVHZW5lcmF0b3IgfSBmcm9tIFwiLi9kZXYvY3NzTW9kdWxlQ2xhc3NOYW1lR2VuZXJhdG9yXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHZpdGVJMThuUGx1Z2luIGZyb20gXCIuL2Rldi92aXRlSTE4blBsdWdpblwiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBhc3NldHNJbmNsdWRlOiBbXCIvc2ItcHJldmlldy9ydW50aW1lLmpzXCJdLFxuICBwbHVnaW5zOiBbdml0ZUkxOG5QbHVnaW5dLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IFtcbiAgICAgIHtcbiAgICAgICAgZmluZDogL0BcXC8vLFxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSkgKyBcIi9zcmMvXCIsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG4gIGNzczoge1xuICAgIHBvc3Rjc3M6IHtcbiAgICAgIHBsdWdpbnM6IFtwb3N0Y3NzTmVzdGluZ10sXG4gICAgfSxcbiAgICBtb2R1bGVzOiB7XG4gICAgICBnZW5lcmF0ZVNjb3BlZE5hbWU6IGNzc01vZHVsZUNsYXNzTmFtZUdlbmVyYXRvcixcbiAgICB9LFxuICB9LFxufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9sbWV5ZXIvRW50d2lja2x1bmcvRnJvbnRlbmQvbmV3L2Zsb3cvcGFja2FnZXMvY29tcG9uZW50cy9kZXZcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9sbWV5ZXIvRW50d2lja2x1bmcvRnJvbnRlbmQvbmV3L2Zsb3cvcGFja2FnZXMvY29tcG9uZW50cy9kZXYvY3NzTW9kdWxlQ2xhc3NOYW1lR2VuZXJhdG9yLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9sbWV5ZXIvRW50d2lja2x1bmcvRnJvbnRlbmQvbmV3L2Zsb3cvcGFja2FnZXMvY29tcG9uZW50cy9kZXYvY3NzTW9kdWxlQ2xhc3NOYW1lR2VuZXJhdG9yLnRzXCI7aW1wb3J0IHsgZGlybmFtZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgKiBhcyBfZGlybmFtZSBmcm9tIFwiLi9kaXJuYW1lLmNqc1wiO1xuaW1wb3J0IGRlY2FtZWxpemUgZnJvbSBcImRlY2FtZWxpemVcIjtcblxuY29uc3QgcGFyZW50RGlyID0gZGlybmFtZShfZGlybmFtZS5kZWZhdWx0KTtcblxuZXhwb3J0IGNvbnN0IGNzc01vZHVsZUNsYXNzTmFtZUdlbmVyYXRvciA9IChcbiAgbmFtZTogc3RyaW5nLFxuICBmaWxlbmFtZTogc3RyaW5nLFxuKTogc3RyaW5nID0+IHtcbiAgbmFtZSA9IGRlY2FtZWxpemUobmFtZSwgeyBzZXBhcmF0b3I6IFwiLVwiIH0pO1xuICBpZiAobmFtZSA9PT0gXCJmbG93XCIpIHtcbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuXG4gIGNvbnN0IHJlbGF0aXZlRmlsZW5hbWUgPSBmaWxlbmFtZS5zdGFydHNXaXRoKHBhcmVudERpcilcbiAgICA/IGZpbGVuYW1lLnNsaWNlKHBhcmVudERpci5sZW5ndGgpXG4gICAgOiBmaWxlbmFtZTtcblxuICBpZiAoIS8uKlxcLm1vZHVsZVxcLnM/Y3NzLy50ZXN0KHJlbGF0aXZlRmlsZW5hbWUpKSB7XG4gICAgcmV0dXJuIG5hbWU7XG4gIH1cblxuICBjb25zdCBwYXJ0cyA9IEFycmF5LmZyb20oXG4gICAgcmVsYXRpdmVGaWxlbmFtZS5tYXRjaEFsbCgvKGNvbXBvbmVudHNcXC8oLis/KVxcLykvZyksXG4gICkubWFwKChwKSA9PiBkZWNhbWVsaXplKHBbMl0sIHsgc2VwYXJhdG9yOiBcIi1cIiB9KS50b0xvd2VyQ2FzZSgpKTtcblxuICBpZiAocGFydHMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGxhc3RQYXJ0ID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV07XG5cbiAgICBpZiAobGFzdFBhcnQgIT09IG5hbWUpIHtcbiAgICAgIHBhcnRzLnB1c2gobmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFwiZmxvdy0tXCIgKyBwYXJ0cy5qb2luKFwiLS1cIik7XG4gIH1cblxuICByZXR1cm4gbmFtZTtcbn07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9sbWV5ZXIvRW50d2lja2x1bmcvRnJvbnRlbmQvbmV3L2Zsb3cvcGFja2FnZXMvY29tcG9uZW50cy9kZXZcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9sbWV5ZXIvRW50d2lja2x1bmcvRnJvbnRlbmQvbmV3L2Zsb3cvcGFja2FnZXMvY29tcG9uZW50cy9kZXYvdml0ZUkxOG5QbHVnaW4udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2xtZXllci9FbnR3aWNrbHVuZy9Gcm9udGVuZC9uZXcvZmxvdy9wYWNrYWdlcy9jb21wb25lbnRzL2Rldi92aXRlSTE4blBsdWdpbi50c1wiO2ltcG9ydCB7IFBsdWdpbiB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgY3J5cHQgZnJvbSBcImNyeXB0b1wiO1xuXG5leHBvcnQgY29uc3QgbW9kdWxlU3VmZml4ID0gXCIubG9jYWxlLmpzb25cIjtcbmV4cG9ydCBjb25zdCBtb2R1bGVJZCA9IGBcXHgwMCR7bW9kdWxlU3VmZml4fUBgO1xuXG5jb25zdCBsb2NhbGVEaXJlY3RvcnkgPSBcImxvY2FsZXNcIjtcbmNvbnN0IGltcG9ydFBhdGhJbmZvc1JlZ0V4ID0gbmV3IFJlZ0V4cChcbiAgYF4oLisvJHtsb2NhbGVEaXJlY3Rvcnl9KS8oKC4rKSR7bW9kdWxlU3VmZml4LnJlcGxhY2VBbGwoXCIuXCIsIFwiXFxcXC5cIil9KSRgLFxuKTtcblxuY29uc3QgZ2VuZXJhdGVDb21wb25lbnRJbnRsQ29udGVudCA9IChcbiAgZmlsZVBhdGg6IHN0cmluZyxcbiAgbGFuZ3VhZ2VLZXk6IHN0cmluZyxcbik6IHN0cmluZyA9PiB7XG4gIGNvbnN0IGxhbmdPYmplY3Q6IHN0cmluZ1tdID0gW107XG5cbiAgaWYgKGxhbmd1YWdlS2V5ID09PSBcIipcIikge1xuICAgIGNvbnN0IGZpbGVEaXJlY3RvcnkgPSBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpO1xuICAgIGZzLnJlYWRkaXJTeW5jKGZpbGVEaXJlY3RvcnkpLmZvckVhY2goKGZpbGU6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oZmlsZURpcmVjdG9yeSwgZmlsZSk7XG4gICAgICBjb25zdCBtYXRjaCA9IGZpbGVQYXRoLm1hdGNoKGltcG9ydFBhdGhJbmZvc1JlZ0V4KTtcblxuICAgICAgY29uc3QgZmlsZUNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsIFwidXRmOFwiKTtcbiAgICAgIGxhbmdPYmplY3QucHVzaChgXCIke21hdGNoICYmIG1hdGNoWzNdfVwiOiR7ZmlsZUNvbnRlbnR9YCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgZmlsZUNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsIFwidXRmOFwiKTtcbiAgICBsYW5nT2JqZWN0LnB1c2goYFwiJHtsYW5ndWFnZUtleX1cIjoke2ZpbGVDb250ZW50fWApO1xuICB9XG5cbiAgcmV0dXJuIGB7JHtsYW5nT2JqZWN0LmpvaW4oXCIsXCIpfX1gO1xufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiBcImhhbmRsZS1pMThuLWltcG9ydFwiLFxuICBlbmZvcmNlOiBcInByZVwiLFxuICBoYW5kbGVIb3RVcGRhdGU6IGFzeW5jICh7IGZpbGUsIHNlcnZlciB9KSA9PiB7XG4gICAgY29uc3QgbG9jYWxlTWF0Y2ggPSBmaWxlLm1hdGNoKGltcG9ydFBhdGhJbmZvc1JlZ0V4KTtcbiAgICBpZiAobG9jYWxlTWF0Y2gpIHtcbiAgICAgIGNvbnN0IGxvY2FsRGlyZWN0b3J5ID0gcGF0aC5kaXJuYW1lKGZpbGUpO1xuICAgICAgZnMucmVhZGRpclN5bmMobG9jYWxEaXJlY3RvcnkpXG4gICAgICAgIC5jb25jYXQoW2AqJHttb2R1bGVTdWZmaXh9YF0pXG4gICAgICAgIC5mb3JFYWNoKChmaWxlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihsb2NhbERpcmVjdG9yeSwgZmlsZSk7XG4gICAgICAgICAgY29uc3QgdmlydHVhbEZpbGVJZCA9IGNyeXB0XG4gICAgICAgICAgICAuY3JlYXRlSGFzaChcIm1kNVwiKVxuICAgICAgICAgICAgLnVwZGF0ZShmaWxlUGF0aClcbiAgICAgICAgICAgIC5kaWdlc3QoXCJoZXhcIik7XG4gICAgICAgICAgY29uc3QgaWQgPSBgJHttb2R1bGVJZH0ke3ZpcnR1YWxGaWxlSWR9YDtcbiAgICAgICAgICBjb25zdCBtb2R1bGUgPSBzZXJ2ZXIubW9kdWxlR3JhcGguZ2V0TW9kdWxlQnlJZChpZCk7XG4gICAgICAgICAgaWYgKG1vZHVsZSkge1xuICAgICAgICAgICAgc2VydmVyLnJlbG9hZE1vZHVsZShtb2R1bGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICB9LFxuICBhc3luYyByZXNvbHZlSWQoaWQ6IHN0cmluZywgaW1wb3J0ZXI6IHN0cmluZykge1xuICAgIGNvbnN0IG1hdGNoID0gaWQubWF0Y2goaW1wb3J0UGF0aEluZm9zUmVnRXgpO1xuICAgIGlmIChtYXRjaCAmJiBpbXBvcnRlcikge1xuICAgICAgY29uc3QgaW1wb3J0ZXJEaXJlY3RvcnkgPSBwYXRoLmRpcm5hbWUoaW1wb3J0ZXIpO1xuICAgICAgY29uc3QgcmVzb2x2ZWRUcmFuc2xhdGlvblBhdGggPSBwYXRoLnJlc29sdmUoaW1wb3J0ZXJEaXJlY3RvcnksIGlkKTtcbiAgICAgIGNvbnN0IHZpcnR1YWxGaWxlSWQgPSBjcnlwdFxuICAgICAgICAuY3JlYXRlSGFzaChcIm1kNVwiKVxuICAgICAgICAudXBkYXRlKHJlc29sdmVkVHJhbnNsYXRpb25QYXRoKVxuICAgICAgICAuZGlnZXN0KFwiaGV4XCIpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogbW9kdWxlSWQgKyB2aXJ0dWFsRmlsZUlkLFxuICAgICAgICBzaG91bGRUcmFuc2Zvcm1DYWNoZWRNb2R1bGU6IHRydWUsXG4gICAgICAgIG1ldGE6IHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBpbXBvcnRlcixcbiAgICAgICAgICBpbXBvcnRlckRpcmVjdG9yeSxcbiAgICAgICAgICByZXNvbHZlZFRyYW5zbGF0aW9uUGF0aCxcbiAgICAgICAgICByZXF1ZXN0ZWRMYW5ndWFnZUtleTogbWF0Y2hbM10sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cbiAgfSxcbiAgbG9hZChpZDogc3RyaW5nKSB7XG4gICAgaWYgKGlkLnN0YXJ0c1dpdGgobW9kdWxlSWQpKSB7XG4gICAgICBjb25zdCB2aXJ0dWFsRmlsZU1vZHVsZSA9IHRoaXMuZ2V0TW9kdWxlSW5mbyhpZCk7XG5cbiAgICAgIGlmICh2aXJ0dWFsRmlsZU1vZHVsZSAmJiB2aXJ0dWFsRmlsZU1vZHVsZS5tZXRhKSB7XG4gICAgICAgIGNvbnN0IG1ldGEgPSB2aXJ0dWFsRmlsZU1vZHVsZS5tZXRhO1xuICAgICAgICBjb25zdCBjb2RlID0gZ2VuZXJhdGVDb21wb25lbnRJbnRsQ29udGVudChcbiAgICAgICAgICBtZXRhLnJlc29sdmVkVHJhbnNsYXRpb25QYXRoLFxuICAgICAgICAgIG1ldGEucmVxdWVzdGVkTGFuZ3VhZ2VLZXksXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjb2RlOiBgZXhwb3J0IGRlZmF1bHQgJHtjb2RlfTtgLFxuICAgICAgICAgIG1hcDogbnVsbCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG59IGFzIFBsdWdpbjtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBLFFBQU1BLG9DQUFtQztBQUE0VSxXQUFPLFVBQVVBO0FBQUE7QUFBQTs7O0FDQVgsU0FBUyxnQkFBQUMsZUFBYyxtQkFBbUI7QUFDcmEsT0FBTyxZQUFZO0FBQ25CLE9BQU8sU0FBUzs7O0FDRitWLFNBQVMsb0JBQW9CO0FBQzVZLE9BQU8sb0JBQW9COzs7QUNBM0IsZUFBMEI7QUFEaVksU0FBUyxlQUFlO0FBRW5iLE9BQU8sZ0JBQWdCO0FBRXZCLElBQU0sWUFBWSxRQUFpQixnQkFBTztBQUVuQyxJQUFNLDhCQUE4QixDQUN6QyxNQUNBLGFBQ1c7QUFDWCxTQUFPLFdBQVcsTUFBTSxFQUFFLFdBQVcsSUFBSSxDQUFDO0FBQzFDLE1BQUksU0FBUyxRQUFRO0FBQ25CLFdBQU87QUFBQSxFQUNUO0FBRUEsUUFBTSxtQkFBbUIsU0FBUyxXQUFXLFNBQVMsSUFDbEQsU0FBUyxNQUFNLFVBQVUsTUFBTSxJQUMvQjtBQUVKLE1BQUksQ0FBQyxvQkFBb0IsS0FBSyxnQkFBZ0IsR0FBRztBQUMvQyxXQUFPO0FBQUEsRUFDVDtBQUVBLFFBQU0sUUFBUSxNQUFNO0FBQUEsSUFDbEIsaUJBQWlCLFNBQVMsd0JBQXdCO0FBQUEsRUFDcEQsRUFBRSxJ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
