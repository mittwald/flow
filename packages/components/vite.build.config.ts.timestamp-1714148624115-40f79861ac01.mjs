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
    var __vite_injected_original_dirname2 = "/Users/marcofalkenberg/dev/flow-next/packages/components/dev";
    module.exports = __vite_injected_original_dirname2;
  }
});

// vite.build.config.ts
import { defineConfig as defineConfig2, mergeConfig } from "file:///Users/marcofalkenberg/dev/flow-next/.yarn/__virtual__/vite-virtual-7d915cbb32/0/cache/vite-npm-5.2.9-69707cedc5-2bf8faa7ae.zip/node_modules/vite/dist/node/index.js";
import banner from "file:///Users/marcofalkenberg/dev/flow-next/.yarn/cache/vite-plugin-banner-npm-0.7.1-d34e69a97b-b638585503.zip/node_modules/vite-plugin-banner/dist/index.mjs";
import dts from "file:///Users/marcofalkenberg/dev/flow-next/.yarn/__virtual__/vite-plugin-dts-virtual-576ab3d53f/0/cache/vite-plugin-dts-npm-3.8.3-d0044ded00-8b9e0fa985.zip/node_modules/vite-plugin-dts/dist/index.mjs";

// vite.config.ts
import { defineConfig } from "file:///Users/marcofalkenberg/dev/flow-next/.yarn/__virtual__/vite-virtual-7d915cbb32/0/cache/vite-npm-5.2.9-69707cedc5-2bf8faa7ae.zip/node_modules/vite/dist/node/index.js";
import postcssNesting from "file:///Users/marcofalkenberg/dev/flow-next/.yarn/__virtual__/postcss-nesting-virtual-cb310d5d19/0/cache/postcss-nesting-npm-12.1.1-8b62a75189-8fac718e69.zip/node_modules/postcss-nesting/dist/index.mjs";

// dev/cssModuleClassNameGenerator.ts
var _dirname = __toESM(require_dirname(), 1);
import { dirname } from "path";
import decamelize from "file:///Users/marcofalkenberg/dev/flow-next/.yarn/cache/decamelize-npm-6.0.0-109b08ac0a-689888f5ea.zip/node_modules/decamelize/index.js";
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
var generateVirtualFileId = (filePath) => {
  const virtualFileId = crypt.createHash("md5").update(path.resolve(filePath)).digest("hex");
  return `${moduleId}${virtualFileId}`;
};
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
        const module = server.moduleGraph.getModuleById(
          generateVirtualFileId(filePath)
        );
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
      return {
        id: generateVirtualFileId(resolvedTranslationPath),
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
var __vite_injected_original_dirname = "/Users/marcofalkenberg/dev/flow-next/packages/components";
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
import { externalizeDeps } from "file:///Users/marcofalkenberg/dev/flow-next/.yarn/__virtual__/vite-plugin-externalize-deps-virtual-f2051659cc/0/cache/vite-plugin-externalize-deps-npm-0.8.0-e8f6177f06-0ed0d2a85f.zip/node_modules/vite-plugin-externalize-deps/dist/index.js";
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
          Action: "./src/components/Action/index.ts",
          Avatar: "./src/components/Avatar/index.ts",
          Breadcrumb: "./src/components/Breadcrumb/index.ts",
          Button: "./src/components/Button/index.ts",
          ButtonGroup: "./src/components/ButtonGroup/index.ts",
          Checkbox: "./src/components/Checkbox/index.ts",
          CheckboxButton: "./src/components/CheckboxButton/index.ts",
          CheckboxGroup: "./src/components/CheckboxGroup/index.ts",
          ColumnLayout: "./src/components/ColumnLayout/index.ts",
          Content: "./src/components/Content/index.ts",
          IllustratedMessage: "./src/components/IllustratedMessage/index.ts",
          ContextMenu: "./src/components/ContextMenu/index.ts",
          controller: "./src/lib/controller/index.ts",
          CopyButton: "./src/components/CopyButton/index.ts",
          FieldDescription: "./src/components/FieldDescription/index.ts",
          FieldError: "./src/components/FieldError/index.ts",
          Header: "./src/components/Header/index.ts",
          HeaderNavigation: "./src/components/HeaderNavigation/index.ts",
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
          LoadingSpinner: "./src/components/LoadingSpinner/index.ts",
          MenuItem: "./src/components/MenuItem/index.ts",
          Modal: "./src/components/Modal/index.ts",
          Navigation: "./src/components/Navigation/index.ts",
          NumberField: "./src/components/NumberField/index.ts",
          Popover: "./src/components/Popover/index.ts",
          ProgressBar: "./src/components/ProgressBar/index.ts",
          RadioGroup: "./src/components/RadioGroup/index.ts",
          Section: "./src/components/Section/index.ts",
          Select: "./src/components/Select/index.ts",
          StatusBadge: "./src/components/StatusBadge/index.ts",
          StatusIcon: "./src/components/StatusIcon/index.ts",
          Switch: "./src/components/Switch/index.ts",
          Tabs: "./src/components/Tabs/index.ts",
          Text: "./src/components/Text/index.ts",
          TextArea: "./src/components/TextArea/index.ts",
          TextField: "./src/components/TextField/index.ts",
          Tooltip: "./src/components/Tooltip/index.ts",
          stylesInit: "./src/styles/index.ts",
          hooks: "./src/lib/hooks/index.ts",
          nextjs: "./src/integrations/nextjs/index.ts",
          "react-hook-form": "./src/integrations/react-hook-form/index.ts"
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZGV2L2Rpcm5hbWUuY2pzIiwgInZpdGUuYnVpbGQuY29uZmlnLnRzIiwgInZpdGUuY29uZmlnLnRzIiwgImRldi9jc3NNb2R1bGVDbGFzc05hbWVHZW5lcmF0b3IudHMiLCAiZGV2L3ZpdGVJMThuUGx1Z2luLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL21hcmNvZmFsa2VuYmVyZy9kZXYvZmxvdy1uZXh0L3BhY2thZ2VzL2NvbXBvbmVudHMvZGV2XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbWFyY29mYWxrZW5iZXJnL2Rldi9mbG93LW5leHQvcGFja2FnZXMvY29tcG9uZW50cy9kZXYvZGlybmFtZS5janNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL21hcmNvZmFsa2VuYmVyZy9kZXYvZmxvdy1uZXh0L3BhY2thZ2VzL2NvbXBvbmVudHMvZGV2L2Rpcm5hbWUuY2pzXCI7bW9kdWxlLmV4cG9ydHMgPSBfX2Rpcm5hbWU7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9tYXJjb2ZhbGtlbmJlcmcvZGV2L2Zsb3ctbmV4dC9wYWNrYWdlcy9jb21wb25lbnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbWFyY29mYWxrZW5iZXJnL2Rldi9mbG93LW5leHQvcGFja2FnZXMvY29tcG9uZW50cy92aXRlLmJ1aWxkLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWFyY29mYWxrZW5iZXJnL2Rldi9mbG93LW5leHQvcGFja2FnZXMvY29tcG9uZW50cy92aXRlLmJ1aWxkLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZywgbWVyZ2VDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IGJhbm5lciBmcm9tIFwidml0ZS1wbHVnaW4tYmFubmVyXCI7XG5pbXBvcnQgZHRzIGZyb20gXCJ2aXRlLXBsdWdpbi1kdHNcIjtcbmltcG9ydCBiYXNlQ29uZmlnIGZyb20gXCIuL3ZpdGUuY29uZmlnXCI7XG5pbXBvcnQgeyBleHRlcm5hbGl6ZURlcHMgfSBmcm9tIFwidml0ZS1wbHVnaW4tZXh0ZXJuYWxpemUtZGVwc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoXG4gIG1lcmdlQ29uZmlnKGJhc2VDb25maWcsIHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICBiYW5uZXIoKGZpbGVuYW1lKSA9PlxuICAgICAgICBmaWxlbmFtZS5lbmRzV2l0aChcIi5qc1wiKSA/ICdcInVzZSBjbGllbnRcIlxcclxcbi8qICovJyA6IFwiXCIsXG4gICAgICApLFxuICAgICAgZXh0ZXJuYWxpemVEZXBzKCksXG4gICAgICBkdHMoe1xuICAgICAgICBpbmNsdWRlOiBbXCJzcmNcIl0sXG4gICAgICAgIG91dERpcjogXCJkaXN0L3R5cGVzXCIsXG4gICAgICB9KSxcbiAgICBdLFxuICAgIGJ1aWxkOiB7XG4gICAgICBsaWI6IHtcbiAgICAgICAgZW50cnk6IHtcbiAgICAgICAgICBBY3Rpb246IFwiLi9zcmMvY29tcG9uZW50cy9BY3Rpb24vaW5kZXgudHNcIixcbiAgICAgICAgICBBdmF0YXI6IFwiLi9zcmMvY29tcG9uZW50cy9BdmF0YXIvaW5kZXgudHNcIixcbiAgICAgICAgICBCcmVhZGNydW1iOiBcIi4vc3JjL2NvbXBvbmVudHMvQnJlYWRjcnVtYi9pbmRleC50c1wiLFxuICAgICAgICAgIEJ1dHRvbjogXCIuL3NyYy9jb21wb25lbnRzL0J1dHRvbi9pbmRleC50c1wiLFxuICAgICAgICAgIEJ1dHRvbkdyb3VwOiBcIi4vc3JjL2NvbXBvbmVudHMvQnV0dG9uR3JvdXAvaW5kZXgudHNcIixcbiAgICAgICAgICBDaGVja2JveDogXCIuL3NyYy9jb21wb25lbnRzL0NoZWNrYm94L2luZGV4LnRzXCIsXG4gICAgICAgICAgQ2hlY2tib3hCdXR0b246IFwiLi9zcmMvY29tcG9uZW50cy9DaGVja2JveEJ1dHRvbi9pbmRleC50c1wiLFxuICAgICAgICAgIENoZWNrYm94R3JvdXA6IFwiLi9zcmMvY29tcG9uZW50cy9DaGVja2JveEdyb3VwL2luZGV4LnRzXCIsXG4gICAgICAgICAgQ29sdW1uTGF5b3V0OiBcIi4vc3JjL2NvbXBvbmVudHMvQ29sdW1uTGF5b3V0L2luZGV4LnRzXCIsXG4gICAgICAgICAgQ29udGVudDogXCIuL3NyYy9jb21wb25lbnRzL0NvbnRlbnQvaW5kZXgudHNcIixcbiAgICAgICAgICBJbGx1c3RyYXRlZE1lc3NhZ2U6IFwiLi9zcmMvY29tcG9uZW50cy9JbGx1c3RyYXRlZE1lc3NhZ2UvaW5kZXgudHNcIixcbiAgICAgICAgICBDb250ZXh0TWVudTogXCIuL3NyYy9jb21wb25lbnRzL0NvbnRleHRNZW51L2luZGV4LnRzXCIsXG4gICAgICAgICAgY29udHJvbGxlcjogXCIuL3NyYy9saWIvY29udHJvbGxlci9pbmRleC50c1wiLFxuICAgICAgICAgIENvcHlCdXR0b246IFwiLi9zcmMvY29tcG9uZW50cy9Db3B5QnV0dG9uL2luZGV4LnRzXCIsXG4gICAgICAgICAgRmllbGREZXNjcmlwdGlvbjogXCIuL3NyYy9jb21wb25lbnRzL0ZpZWxkRGVzY3JpcHRpb24vaW5kZXgudHNcIixcbiAgICAgICAgICBGaWVsZEVycm9yOiBcIi4vc3JjL2NvbXBvbmVudHMvRmllbGRFcnJvci9pbmRleC50c1wiLFxuICAgICAgICAgIEhlYWRlcjogXCIuL3NyYy9jb21wb25lbnRzL0hlYWRlci9pbmRleC50c1wiLFxuICAgICAgICAgIEhlYWRlck5hdmlnYXRpb246IFwiLi9zcmMvY29tcG9uZW50cy9IZWFkZXJOYXZpZ2F0aW9uL2luZGV4LnRzXCIsXG4gICAgICAgICAgSGVhZGluZzogXCIuL3NyYy9jb21wb25lbnRzL0hlYWRpbmcvaW5kZXgudHNcIixcbiAgICAgICAgICBJY29uOiBcIi4vc3JjL2NvbXBvbmVudHMvSWNvbi9pbmRleC50c1wiLFxuICAgICAgICAgIEljb25zOiBcIi4vc3JjL2NvbXBvbmVudHMvSWNvbi9jb21wb25lbnRzL2ljb25zL2luZGV4LnRzXCIsXG4gICAgICAgICAgSW1hZ2U6IFwiLi9zcmMvY29tcG9uZW50cy9JbWFnZS9pbmRleC50c1wiLFxuICAgICAgICAgIEluaXRpYWxzOiBcIi4vc3JjL2NvbXBvbmVudHMvSW5pdGlhbHMvaW5kZXgudHNcIixcbiAgICAgICAgICBJbmxpbmVBbGVydDogXCIuL3NyYy9jb21wb25lbnRzL0lubGluZUFsZXJ0L2luZGV4LnRzXCIsXG4gICAgICAgICAgSW5saW5lQ29kZTogXCIuL3NyYy9jb21wb25lbnRzL0lubGluZUNvZGUvaW5kZXgudHNcIixcbiAgICAgICAgICBMYWJlbDogXCIuL3NyYy9jb21wb25lbnRzL0xhYmVsL2luZGV4LnRzXCIsXG4gICAgICAgICAgTGFiZWxlZFZhbHVlOiBcIi4vc3JjL2NvbXBvbmVudHMvTGFiZWxlZFZhbHVlL2luZGV4LnRzXCIsXG4gICAgICAgICAgTGF5b3V0Q2FyZDogXCIuL3NyYy9jb21wb25lbnRzL0xheW91dENhcmQvaW5kZXgudHNcIixcbiAgICAgICAgICBMaW5rOiBcIi4vc3JjL2NvbXBvbmVudHMvTGluay9pbmRleC50c1wiLFxuICAgICAgICAgIExpc3Q6IFwiLi9zcmMvY29tcG9uZW50cy9MaXN0L2luZGV4LnRzXCIsXG4gICAgICAgICAgXCJMaXN0L0xpc3RMb2FkZXJBc3luY1Jlc291cmNlXCI6XG4gICAgICAgICAgICBcIi4vc3JjL2NvbXBvbmVudHMvTGlzdC9jb21wb25lbnRzL0xpc3RMb2FkZXJBc3luY1Jlc291cmNlLnRzXCIsXG4gICAgICAgICAgTG9hZGluZ1NwaW5uZXI6IFwiLi9zcmMvY29tcG9uZW50cy9Mb2FkaW5nU3Bpbm5lci9pbmRleC50c1wiLFxuICAgICAgICAgIE1lbnVJdGVtOiBcIi4vc3JjL2NvbXBvbmVudHMvTWVudUl0ZW0vaW5kZXgudHNcIixcbiAgICAgICAgICBNb2RhbDogXCIuL3NyYy9jb21wb25lbnRzL01vZGFsL2luZGV4LnRzXCIsXG4gICAgICAgICAgTmF2aWdhdGlvbjogXCIuL3NyYy9jb21wb25lbnRzL05hdmlnYXRpb24vaW5kZXgudHNcIixcbiAgICAgICAgICBOdW1iZXJGaWVsZDogXCIuL3NyYy9jb21wb25lbnRzL051bWJlckZpZWxkL2luZGV4LnRzXCIsXG4gICAgICAgICAgUG9wb3ZlcjogXCIuL3NyYy9jb21wb25lbnRzL1BvcG92ZXIvaW5kZXgudHNcIixcbiAgICAgICAgICBQcm9ncmVzc0JhcjogXCIuL3NyYy9jb21wb25lbnRzL1Byb2dyZXNzQmFyL2luZGV4LnRzXCIsXG4gICAgICAgICAgUmFkaW9Hcm91cDogXCIuL3NyYy9jb21wb25lbnRzL1JhZGlvR3JvdXAvaW5kZXgudHNcIixcbiAgICAgICAgICBTZWN0aW9uOiBcIi4vc3JjL2NvbXBvbmVudHMvU2VjdGlvbi9pbmRleC50c1wiLFxuICAgICAgICAgIFNlbGVjdDogXCIuL3NyYy9jb21wb25lbnRzL1NlbGVjdC9pbmRleC50c1wiLFxuICAgICAgICAgIFN0YXR1c0JhZGdlOiBcIi4vc3JjL2NvbXBvbmVudHMvU3RhdHVzQmFkZ2UvaW5kZXgudHNcIixcbiAgICAgICAgICBTdGF0dXNJY29uOiBcIi4vc3JjL2NvbXBvbmVudHMvU3RhdHVzSWNvbi9pbmRleC50c1wiLFxuICAgICAgICAgIFN3aXRjaDogXCIuL3NyYy9jb21wb25lbnRzL1N3aXRjaC9pbmRleC50c1wiLFxuICAgICAgICAgIFRhYnM6IFwiLi9zcmMvY29tcG9uZW50cy9UYWJzL2luZGV4LnRzXCIsXG4gICAgICAgICAgVGV4dDogXCIuL3NyYy9jb21wb25lbnRzL1RleHQvaW5kZXgudHNcIixcbiAgICAgICAgICBUZXh0QXJlYTogXCIuL3NyYy9jb21wb25lbnRzL1RleHRBcmVhL2luZGV4LnRzXCIsXG4gICAgICAgICAgVGV4dEZpZWxkOiBcIi4vc3JjL2NvbXBvbmVudHMvVGV4dEZpZWxkL2luZGV4LnRzXCIsXG4gICAgICAgICAgVG9vbHRpcDogXCIuL3NyYy9jb21wb25lbnRzL1Rvb2x0aXAvaW5kZXgudHNcIixcbiAgICAgICAgICBzdHlsZXNJbml0OiBcIi4vc3JjL3N0eWxlcy9pbmRleC50c1wiLFxuICAgICAgICAgIGhvb2tzOiBcIi4vc3JjL2xpYi9ob29rcy9pbmRleC50c1wiLFxuICAgICAgICAgIG5leHRqczogXCIuL3NyYy9pbnRlZ3JhdGlvbnMvbmV4dGpzL2luZGV4LnRzXCIsXG4gICAgICAgICAgXCJyZWFjdC1ob29rLWZvcm1cIjogXCIuL3NyYy9pbnRlZ3JhdGlvbnMvcmVhY3QtaG9vay1mb3JtL2luZGV4LnRzXCIsXG4gICAgICAgIH0sXG4gICAgICAgIGZvcm1hdHM6IFtcImVzXCJdLFxuICAgICAgfSxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm86IHsgbmFtZTogc3RyaW5nIH0pID0+IHtcbiAgICAgICAgICAgIGlmIChhc3NldEluZm8ubmFtZSA9PT0gXCJzdHlsZS5jc3NcIikge1xuICAgICAgICAgICAgICByZXR1cm4gXCJzdHlsZXMuY3NzXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXNzZXRJbmZvLm5hbWU7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSksXG4pO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWFyY29mYWxrZW5iZXJnL2Rldi9mbG93LW5leHQvcGFja2FnZXMvY29tcG9uZW50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL21hcmNvZmFsa2VuYmVyZy9kZXYvZmxvdy1uZXh0L3BhY2thZ2VzL2NvbXBvbmVudHMvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL21hcmNvZmFsa2VuYmVyZy9kZXYvZmxvdy1uZXh0L3BhY2thZ2VzL2NvbXBvbmVudHMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHBvc3Rjc3NOZXN0aW5nIGZyb20gXCJwb3N0Y3NzLW5lc3RpbmdcIjtcbmltcG9ydCB7IGNzc01vZHVsZUNsYXNzTmFtZUdlbmVyYXRvciB9IGZyb20gXCIuL2Rldi9jc3NNb2R1bGVDbGFzc05hbWVHZW5lcmF0b3JcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgdml0ZUkxOG5QbHVnaW4gZnJvbSBcIi4vZGV2L3ZpdGVJMThuUGx1Z2luXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGFzc2V0c0luY2x1ZGU6IFtcIi9zYi1wcmV2aWV3L3J1bnRpbWUuanNcIl0sXG4gIHBsdWdpbnM6IFt2aXRlSTE4blBsdWdpbl0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczogW1xuICAgICAge1xuICAgICAgICBmaW5kOiAvQFxcLy8sXG4gICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lKSArIFwiL3NyYy9cIixcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbiAgY3NzOiB7XG4gICAgcG9zdGNzczoge1xuICAgICAgcGx1Z2luczogW3Bvc3Rjc3NOZXN0aW5nXSxcbiAgICB9LFxuICAgIG1vZHVsZXM6IHtcbiAgICAgIGdlbmVyYXRlU2NvcGVkTmFtZTogY3NzTW9kdWxlQ2xhc3NOYW1lR2VuZXJhdG9yLFxuICAgIH0sXG4gIH0sXG59KTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL21hcmNvZmFsa2VuYmVyZy9kZXYvZmxvdy1uZXh0L3BhY2thZ2VzL2NvbXBvbmVudHMvZGV2XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbWFyY29mYWxrZW5iZXJnL2Rldi9mbG93LW5leHQvcGFja2FnZXMvY29tcG9uZW50cy9kZXYvY3NzTW9kdWxlQ2xhc3NOYW1lR2VuZXJhdG9yLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tYXJjb2ZhbGtlbmJlcmcvZGV2L2Zsb3ctbmV4dC9wYWNrYWdlcy9jb21wb25lbnRzL2Rldi9jc3NNb2R1bGVDbGFzc05hbWVHZW5lcmF0b3IudHNcIjtpbXBvcnQgeyBkaXJuYW1lIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCAqIGFzIF9kaXJuYW1lIGZyb20gXCIuL2Rpcm5hbWUuY2pzXCI7XG5pbXBvcnQgZGVjYW1lbGl6ZSBmcm9tIFwiZGVjYW1lbGl6ZVwiO1xuXG5jb25zdCBwYXJlbnREaXIgPSBkaXJuYW1lKF9kaXJuYW1lLmRlZmF1bHQpO1xuXG5leHBvcnQgY29uc3QgY3NzTW9kdWxlQ2xhc3NOYW1lR2VuZXJhdG9yID0gKFxuICBuYW1lOiBzdHJpbmcsXG4gIGZpbGVuYW1lOiBzdHJpbmcsXG4pOiBzdHJpbmcgPT4ge1xuICBuYW1lID0gZGVjYW1lbGl6ZShuYW1lLCB7IHNlcGFyYXRvcjogXCItXCIgfSk7XG4gIGlmIChuYW1lID09PSBcImZsb3dcIikge1xuICAgIHJldHVybiBuYW1lO1xuICB9XG5cbiAgY29uc3QgcmVsYXRpdmVGaWxlbmFtZSA9IGZpbGVuYW1lLnN0YXJ0c1dpdGgocGFyZW50RGlyKVxuICAgID8gZmlsZW5hbWUuc2xpY2UocGFyZW50RGlyLmxlbmd0aClcbiAgICA6IGZpbGVuYW1lO1xuXG4gIGlmICghLy4qXFwubW9kdWxlXFwucz9jc3MvLnRlc3QocmVsYXRpdmVGaWxlbmFtZSkpIHtcbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuXG4gIGNvbnN0IHBhcnRzID0gQXJyYXkuZnJvbShcbiAgICByZWxhdGl2ZUZpbGVuYW1lLm1hdGNoQWxsKC8oY29tcG9uZW50c1xcLyguKz8pXFwvKS9nKSxcbiAgKS5tYXAoKHApID0+IGRlY2FtZWxpemUocFsyXSwgeyBzZXBhcmF0b3I6IFwiLVwiIH0pLnRvTG93ZXJDYXNlKCkpO1xuXG4gIGlmIChwYXJ0cy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgbGFzdFBhcnQgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXTtcblxuICAgIGlmIChsYXN0UGFydCAhPT0gbmFtZSkge1xuICAgICAgcGFydHMucHVzaChuYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gXCJmbG93LS1cIiArIHBhcnRzLmpvaW4oXCItLVwiKTtcbiAgfVxuXG4gIHJldHVybiBuYW1lO1xufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL21hcmNvZmFsa2VuYmVyZy9kZXYvZmxvdy1uZXh0L3BhY2thZ2VzL2NvbXBvbmVudHMvZGV2XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbWFyY29mYWxrZW5iZXJnL2Rldi9mbG93LW5leHQvcGFja2FnZXMvY29tcG9uZW50cy9kZXYvdml0ZUkxOG5QbHVnaW4udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL21hcmNvZmFsa2VuYmVyZy9kZXYvZmxvdy1uZXh0L3BhY2thZ2VzL2NvbXBvbmVudHMvZGV2L3ZpdGVJMThuUGx1Z2luLnRzXCI7aW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCAqIGFzIGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0IGNyeXB0IGZyb20gXCJjcnlwdG9cIjtcblxuZXhwb3J0IGNvbnN0IG1vZHVsZVN1ZmZpeCA9IFwiLmxvY2FsZS5qc29uXCI7XG5leHBvcnQgY29uc3QgbW9kdWxlSWQgPSBgXFx4MDAke21vZHVsZVN1ZmZpeH1AYDtcblxuY29uc3QgbG9jYWxlRGlyZWN0b3J5ID0gXCJsb2NhbGVzXCI7XG5jb25zdCBpbXBvcnRQYXRoSW5mb3NSZWdFeCA9IG5ldyBSZWdFeHAoXG4gIGBeKC4rLyR7bG9jYWxlRGlyZWN0b3J5fSkvKCguKykke21vZHVsZVN1ZmZpeC5yZXBsYWNlQWxsKFwiLlwiLCBcIlxcXFwuXCIpfSkkYCxcbik7XG5cbmV4cG9ydCBjb25zdCBnZW5lcmF0ZVZpcnR1YWxGaWxlSWQgPSAoZmlsZVBhdGg6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gIGNvbnN0IHZpcnR1YWxGaWxlSWQgPSBjcnlwdFxuICAgIC5jcmVhdGVIYXNoKFwibWQ1XCIpXG4gICAgLnVwZGF0ZShwYXRoLnJlc29sdmUoZmlsZVBhdGgpKVxuICAgIC5kaWdlc3QoXCJoZXhcIik7XG4gIHJldHVybiBgJHttb2R1bGVJZH0ke3ZpcnR1YWxGaWxlSWR9YDtcbn07XG5cbmNvbnN0IGdlbmVyYXRlQ29tcG9uZW50SW50bENvbnRlbnQgPSAoXG4gIGZpbGVQYXRoOiBzdHJpbmcsXG4gIGxhbmd1YWdlS2V5OiBzdHJpbmcsXG4pOiBzdHJpbmcgPT4ge1xuICBjb25zdCBsYW5nT2JqZWN0OiBzdHJpbmdbXSA9IFtdO1xuXG4gIGlmIChsYW5ndWFnZUtleSA9PT0gXCIqXCIpIHtcbiAgICBjb25zdCBmaWxlRGlyZWN0b3J5ID0gcGF0aC5kaXJuYW1lKGZpbGVQYXRoKTtcbiAgICBmcy5yZWFkZGlyU3luYyhmaWxlRGlyZWN0b3J5KS5mb3JFYWNoKChmaWxlOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKGZpbGVEaXJlY3RvcnksIGZpbGUpO1xuICAgICAgY29uc3QgbWF0Y2ggPSBmaWxlUGF0aC5tYXRjaChpbXBvcnRQYXRoSW5mb3NSZWdFeCk7XG5cbiAgICAgIGNvbnN0IGZpbGVDb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCBcInV0ZjhcIik7XG4gICAgICBsYW5nT2JqZWN0LnB1c2goYFwiJHttYXRjaCAmJiBtYXRjaFszXX1cIjoke2ZpbGVDb250ZW50fWApO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGZpbGVDb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCBcInV0ZjhcIik7XG4gICAgbGFuZ09iamVjdC5wdXNoKGBcIiR7bGFuZ3VhZ2VLZXl9XCI6JHtmaWxlQ29udGVudH1gKTtcbiAgfVxuXG4gIHJldHVybiBgeyR7bGFuZ09iamVjdC5qb2luKFwiLFwiKX19YDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogXCJoYW5kbGUtaTE4bi1pbXBvcnRcIixcbiAgZW5mb3JjZTogXCJwcmVcIixcbiAgaGFuZGxlSG90VXBkYXRlOiBhc3luYyAoeyBmaWxlLCBzZXJ2ZXIgfSkgPT4ge1xuICAgIGNvbnN0IGxvY2FsZU1hdGNoID0gZmlsZS5tYXRjaChpbXBvcnRQYXRoSW5mb3NSZWdFeCk7XG4gICAgaWYgKGxvY2FsZU1hdGNoKSB7XG4gICAgICBjb25zdCBsb2NhbERpcmVjdG9yeSA9IHBhdGguZGlybmFtZShmaWxlKTtcbiAgICAgIGZzLnJlYWRkaXJTeW5jKGxvY2FsRGlyZWN0b3J5KVxuICAgICAgICAuY29uY2F0KFtgKiR7bW9kdWxlU3VmZml4fWBdKVxuICAgICAgICAuZm9yRWFjaCgoZmlsZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4obG9jYWxEaXJlY3RvcnksIGZpbGUpO1xuICAgICAgICAgIGNvbnN0IG1vZHVsZSA9IHNlcnZlci5tb2R1bGVHcmFwaC5nZXRNb2R1bGVCeUlkKFxuICAgICAgICAgICAgZ2VuZXJhdGVWaXJ0dWFsRmlsZUlkKGZpbGVQYXRoKSxcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChtb2R1bGUpIHtcbiAgICAgICAgICAgIHNlcnZlci5yZWxvYWRNb2R1bGUobW9kdWxlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgYXN5bmMgcmVzb2x2ZUlkKGlkOiBzdHJpbmcsIGltcG9ydGVyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBtYXRjaCA9IGlkLm1hdGNoKGltcG9ydFBhdGhJbmZvc1JlZ0V4KTtcbiAgICBpZiAobWF0Y2ggJiYgaW1wb3J0ZXIpIHtcbiAgICAgIGNvbnN0IGltcG9ydGVyRGlyZWN0b3J5ID0gcGF0aC5kaXJuYW1lKGltcG9ydGVyKTtcbiAgICAgIGNvbnN0IHJlc29sdmVkVHJhbnNsYXRpb25QYXRoID0gcGF0aC5yZXNvbHZlKGltcG9ydGVyRGlyZWN0b3J5LCBpZCk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiBnZW5lcmF0ZVZpcnR1YWxGaWxlSWQocmVzb2x2ZWRUcmFuc2xhdGlvblBhdGgpLFxuICAgICAgICBtZXRhOiB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgaW1wb3J0ZXIsXG4gICAgICAgICAgaW1wb3J0ZXJEaXJlY3RvcnksXG4gICAgICAgICAgcmVzb2x2ZWRUcmFuc2xhdGlvblBhdGgsXG4gICAgICAgICAgcmVxdWVzdGVkTGFuZ3VhZ2VLZXk6IG1hdGNoWzNdLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9XG4gIH0sXG4gIGxvYWQoaWQ6IHN0cmluZykge1xuICAgIGlmIChpZC5zdGFydHNXaXRoKG1vZHVsZUlkKSkge1xuICAgICAgY29uc3QgdmlydHVhbEZpbGVNb2R1bGUgPSB0aGlzLmdldE1vZHVsZUluZm8oaWQpO1xuXG4gICAgICBpZiAodmlydHVhbEZpbGVNb2R1bGUgJiYgdmlydHVhbEZpbGVNb2R1bGUubWV0YSkge1xuICAgICAgICBjb25zdCBtZXRhID0gdmlydHVhbEZpbGVNb2R1bGUubWV0YTtcbiAgICAgICAgY29uc3QgY29kZSA9IGdlbmVyYXRlQ29tcG9uZW50SW50bENvbnRlbnQoXG4gICAgICAgICAgbWV0YS5yZXNvbHZlZFRyYW5zbGF0aW9uUGF0aCxcbiAgICAgICAgICBtZXRhLnJlcXVlc3RlZExhbmd1YWdlS2V5LFxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29kZTogYGV4cG9ydCBkZWZhdWx0ICR7Y29kZX07YCxcbiAgICAgICAgICBtYXA6IG51bGwsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICB9LFxufSBhcyBQbHVnaW47XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQUFNQSxvQ0FBbUM7QUFBdVQsV0FBTyxVQUFVQTtBQUFBO0FBQUE7OztBQ0FYLFNBQVMsZ0JBQUFDLGVBQWMsbUJBQW1CO0FBQ2haLE9BQU8sWUFBWTtBQUNuQixPQUFPLFNBQVM7OztBQ0YwVSxTQUFTLG9CQUFvQjtBQUN2WCxPQUFPLG9CQUFvQjs7O0FDQTNCLGVBQTBCO0FBRDRXLFNBQVMsZUFBZTtBQUU5WixPQUFPLGdCQUFnQjtBQUV2QixJQUFNLFlBQVksUUFBaUIsZ0JBQU87QUFFbkMsSUFBTSw4QkFBOEIsQ0FDekMsTUFDQSxhQUNXO0FBQ1gsU0FBTyxXQUFXLE1BQU0sRUFBRSxXQUFXLElBQUksQ0FBQztBQUMxQyxNQUFJLFNBQVMsUUFBUTtBQUNuQixXQUFPO0FBQUEsRUFDVDtBQUVBLFFBQU0sbUJBQW1CLFNBQVMsV0FBVyxTQUFTLElBQ2xELFNBQVMsTUFBTSxVQUFVLE1BQU0sSUFDL0I7QUFFSixNQUFJLENBQUMsb0JBQW9CLEtBQUssZ0JBQWdCLEdBQUc7QUFDL0MsV0FBTztBQUFBLEVBQ1Q7QUFFQSxRQUFNLFFBQVEsTUFBTTtBQUFBLElBQ2xCLGlCQUFpQixTQUFTLHdCQUF3QjtBQUFBLEVBQ3BELEVBQUUsSUFBSSxDQUFDLE1BQU0sV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLFdBQVcsSUFB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VUFDTCxRQUFRO0FBQUEsVUFDUixRQUFRO0FBQUEsVUFDUixZQUFZO0FBQUEsVUFDWixRQUFRO0FBQUEsVUFDUixhQUFhO0FBQUEsVUFDYixVQUFVO0FBQUEsVUFDVixnQkFBZ0I7QUFBQSxVQUNoQixlQUFlO0FBQUEsVUFDZixjQUFjO0FBQUEsVUFDZCxTQUFTO0FBQUEsVUFDVCxvQkFBb0I7QUFBQSxVQUNwQixhQUFhO0FBQUEsVUFDYixZQUFZO0FBQUEsVUFDWixZQUFZO0FBQUEsVUFDWixrQkFBa0I7QUFBQSxVQUNsQixZQUFZO0FBQUEsVUFDWixRQUFRO0FBQUEsVUFDUixrQkFBa0I7QUFBQSxVQUNsQixTQUFTO0FBQUEsVUFDVCxNQUFNO0FBQUEsVUFDTixPQUFPO0FBQUEsVUFDUCxPQUFPO0FBQUEsVUFDUCxVQUFVO0FBQUEsVUFDVixhQUFhO0FBQUEsVUFDYixZQUFZO0FBQUEsVUFDWixPQUFPO0FBQUEsVUFDUCxjQUFjO0FBQUEsVUFDZCxZQUFZO0FBQUEsVUFDWixNQUFNO0FBQUEsVUFDTixNQUFNO0FBQUEsVUFDTixnQ0FDRTtBQUFBLFVBQ0YsZ0JBQWdCO0FBQUEsVUFDaEIsVUFBVTtBQUFBLFVBQ1YsT0FBTztBQUFBLFVBQ1AsWUFBWTtBQUFBLFVBQ1osYUFBYTtBQUFBLFVBQ2IsU0FBUztBQUFBLFVBQ1QsYUFBYTtBQUFBLFVBQ2IsWUFBWTtBQUFBLFVBQ1osU0FBUztBQUFBLFVBQ1QsUUFBUTtBQUFBLFVBQ1IsYUFBYTtBQUFBLFVBQ2IsWUFBWTtBQUFBLFVBQ1osUUFBUTtBQUFBLFVBQ1IsTUFBTTtBQUFBLFVBQ04sTUFBTTtBQUFBLFVBQ04sVUFBVTtBQUFBLFVBQ1YsV0FBVztBQUFBLFVBQ1gsU0FBUztBQUFBLFVBQ1QsWUFBWTtBQUFBLFVBQ1osT0FBTztBQUFBLFVBQ1AsUUFBUTtBQUFBLFVBQ1IsbUJBQW1CO0FBQUEsUUFDckI7QUFBQSxRQUNBLFNBQVMsQ0FBQyxJQUFJO0FBQUEsTUFDaEI7QUFBQSxNQUNBLGVBQWU7QUFBQSxRQUNiLFFBQVE7QUFBQSxVQUNOLGdCQUFnQixDQUFDLGNBQWdDO0FBQy9DLGdCQUFJLFVBQVUsU0FBUyxhQUFhO0FBQ2xDLHFCQUFPO0FBQUEsWUFDVDtBQUNBLG1CQUFPLFVBQVU7QUFBQSxVQUNuQjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0YsQ0FBQztBQUNIOyIsCiAgIm5hbWVzIjogWyJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJkZWZpbmVDb25maWciLCAicGF0aCIsICJmaWxlUGF0aCIsICJmaWxlIiwgInBhdGgiLCAiZGVmaW5lQ29uZmlnIl0KfQo=
