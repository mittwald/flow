import { defineConfig, mergeConfig } from "vite";
import banner from "vite-plugin-banner";
import dts from "vite-plugin-dts";
import baseConfig from "./vite.config";
import { externalizeDeps } from "vite-plugin-externalize-deps";

export default defineConfig(
  mergeConfig(baseConfig, {
    plugins: [
      banner((filename) =>
        filename.endsWith(".js") ? '"use client"\r\n/* */' : "",
      ),
      externalizeDeps(),
      dts({
        include: ["src"],
        outDir: "dist/types",
      }),
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
          "List/ListLoaderAsyncResource":
            "./src/components/List/components/ListLoaderAsyncResource.ts",
          Modal: "./src/components/Modal/index.ts",
          Navigation: "./src/components/Navigation/index.ts",
          NumberField: "./src/components/NumberField/index.ts",
          Popover: "./src/components/Popover/index.ts",
          RadioGroup: "./src/components/RadioGroup/index.ts",
          Section: "./src/components/Section/index.ts",
          Select: "./src/components/Select/index.ts",
          StatusBadge: "./src/components/StatusBadge/index.ts",
          StatusIcon: "./src/components/StatusIcon/index.ts",
          Switch: "./src/components/Switch/index.ts",
          Text: "./src/components/Text/index.ts",
          TextArea: "./src/components/TextArea/index.ts",
          TextField: "./src/components/TextField/index.ts",
          Tooltip: "./src/components/Tooltip/index.ts",
          stylesInit: "./src/styles/index.ts",
          "nextjs/LinkProvider":
            "./src/components/nextjs/LinkProvider/index.ts",
        },
        formats: ["es"],
      },
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo: { name: string }) => {
            if (assetInfo.name === "style.css") {
              return "styles.css";
            }
            return assetInfo.name;
          },
        },
      },
    },
  }),
);
