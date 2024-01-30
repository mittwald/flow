import { defineConfig, mergeConfig } from "vite";
import banner from "vite-plugin-banner";
import dts from "vite-plugin-dts";
import baseConfig from "./vite.config";

export default defineConfig(
  mergeConfig(baseConfig, {
    plugins: [
      banner((filename) =>
        filename.endsWith(".js") ? '"use client"\r\n/* */' : "",
      ),
      dts({ rollupTypes: true }),
    ],
    build: {
      lib: {
        entry: {
          Avatar: "./src/components/Avatar/index.ts",
          Badge: "./src/components/Badge/index.ts",
          Button: "./src/components/Button/index.ts",
          Checkbox: "./src/components/Checkbox/index.ts",
          Content: "./src/components/Content/index.ts",
          CopyButton: "./src/components/CopyButton/index.ts",
          FieldDescription: "./src/components/FieldDescription/index.ts",
          FieldError: "./src/components/FieldError/index.ts",
          Heading: "./src/components/Heading/index.ts",
          Icon: "./src/components/Icon/index.ts",
          Image: "./src/components/Image/index.ts",
          Initials: "./src/components/Initials/index.ts",
          Label: "./src/components/Label/index.ts",
          LabeledValue: "./src/components/LabeledValue/index.ts",
          Link: "./src/components/Link/index.ts",
          Navigation: "./src/components/Navigation/index.ts",
          Note: "./src/components/Note/index.ts",
          Radio: "./src/components/RadioGroup/components/Radio/index.ts",
          RadioGroup: "./src/components/RadioGroup/index.ts",
          StatusIcon: "./src/components/StatusIcon/index.ts",
          Switch: "./src/components/Switch/index.ts",
          Text: "./src/components/Text/index.ts",
          TextArea: "./src/components/TextArea/index.ts",
          TextField: "./src/components/TextField/index.ts",
          Tooltip: "./src/components/Tooltip/index.ts",
          TooltipTrigger:
            "./src/components/Tooltip/components/TooltipTrigger/index.ts",
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
        external: [
          "react",
          "react-dom",
          "@fortawesome/react-fontawesome",
          "@fortawesome/fontawesome-svg-core",
          "@react-aria/utils",
          "@react-types/shared",
          "html-react-parser",
          "react-aria",
          "react-aria-components",
          "react-stately",
          "remeda",
        ],
      },
    },
  }),
);
