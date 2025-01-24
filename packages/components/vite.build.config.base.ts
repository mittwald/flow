import type { LibraryOptions, PluginOption } from "vite";
import { defineConfig, mergeConfig } from "vite";
import banner from "vite-plugin-banner";
import dts from "vite-plugin-dts";
import baseConfig from "./vite.config";
import { externalizeDeps } from "vite-plugin-externalize-deps";

interface Options {
  mode: "cssChunks" | "default";
}

export const buildConfig = (opts: Options) => {
  const { mode } = opts;
  const outDir = mode === "cssChunks" ? "dist/css" : "dist/js";

  const plugins: PluginOption[] =
    mode === "cssChunks"
      ? []
      : [
          banner((filename) =>
            filename.endsWith(".js") ? '"use client"\r\n/* */' : "",
          ),
          externalizeDeps(),
          dts({
            include: ["src"],
            outDir: "dist/js/types",
          }),
        ];

  const cssCodeSplit = mode === "cssChunks";

  const entryPoints: LibraryOptions["entry"] = {
    Accordion: "./src/components/Accordion/index.ts",
    Action: "./src/components/Action/index.ts",
    Activity: "./src/components/Activity/index.ts",
    ActionGroup: "./src/components/ActionGroup/index.ts",
    Alert: "./src/components/Alert/index.ts",
    AlertBadge: "./src/components/AlertBadge/index.ts",
    AlertIcon: "./src/components/AlertIcon/index.ts",
    Align: "./src/components/Align/index.ts",
    Avatar: "./src/components/Avatar/index.ts",
    Badge: "./src/components/Badge/index.ts",
    Breadcrumb: "./src/components/Breadcrumb/index.ts",
    Button: "./src/components/Button/index.ts",
    Checkbox: "./src/components/Checkbox/index.ts",
    CheckboxButton: "./src/components/CheckboxButton/index.ts",
    CheckboxGroup: "./src/components/CheckboxGroup/index.ts",
    CodeBlock: "./src/components/CodeBlock/index.ts",
    ColumnLayout: "./src/components/ColumnLayout/index.ts",
    ComboBox: "./src/components/ComboBox/index.ts",
    Content: "./src/components/Content/index.ts",
    ContextMenu: "./src/components/ContextMenu/index.ts",
    ContextualHelp: "./src/components/ContextualHelp/index.ts",
    controller: "./src/lib/controller/index.ts",
    CopyButton: "./src/components/CopyButton/index.ts",
    CounterBadge: "./src/components/CounterBadge/index.ts",
    DatePicker: "./src/components/DatePicker/index.ts",
    DateRangePicker: "./src/components/DateRangePicker/index.ts",
    EmulatedBoldText: "./src/components/EmulatedBoldText/index.ts",
    FieldDescription: "./src/components/FieldDescription/index.ts",
    FieldError: "./src/components/FieldError/index.ts",
    FileField: "./src/components/FileField/index.ts",
    FileCard: "./src/components/FileCard/index.ts",
    FileCardList: "./src/components/FileCardList/index.ts",
    Header: "./src/components/Header/index.ts",
    HeaderNavigation: "./src/components/HeaderNavigation/index.ts",
    Heading: "./src/components/Heading/index.ts",
    Icon: "./src/components/Icon/index.ts",
    Icons: "./src/components/Icon/components/icons/index.ts",
    IllustratedMessage: "./src/components/IllustratedMessage/index.ts",
    Image: "./src/components/Image/index.ts",
    Initials: "./src/components/Initials/index.ts",
    InlineCode: "./src/components/InlineCode/index.ts",
    Label: "./src/components/Label/index.ts",
    LabeledValue: "./src/components/LabeledValue/index.ts",
    LayoutCard: "./src/components/LayoutCard/index.ts",
    LightBox: "./src/components/LightBox/index.ts",
    Link: "./src/components/Link/index.ts",
    List: "./src/components/List/index.ts",
    "List/ListLoaderAsyncResource":
      "./src/components/List/setupComponents/ListLoaderAsyncResource.ts",
    LoadingSpinner: "./src/components/LoadingSpinner/index.ts",
    Markdown: "./src/components/Markdown/index.ts",
    MenuItem: "./src/components/MenuItem/index.ts",
    Message: "./src/components/Message/index.ts",
    Modal: "./src/components/Modal/index.ts",
    Navigation: "./src/components/Navigation/index.ts",
    Notification: "./src/components/Notification/index.ts",
    NotificationProvider: "./src/components/NotificationProvider/index.ts",
    NumberField: "./src/components/NumberField/index.ts",
    Option: "./src/components/Option/index.ts",
    Popover: "./src/components/Popover/index.ts",
    ProgressBar: "./src/components/ProgressBar/index.ts",
    PropsContextProvider: "./src/lib/propsContext/PropsContextProvider.tsx",
    RadioGroup: "./src/components/RadioGroup/index.ts",
    Render: "./src/lib/react/components/Render/index.ts",
    SearchField: "./src/components/SearchField/index.ts",
    Section: "./src/components/Section/index.ts",
    SegmentedControl: "./src/components/SegmentedControl/index.ts",
    Select: "./src/components/Select/index.ts",
    Separator: "./src/components/Separator/index.ts",
    SettingsProvider: "./src/components/SettingsProvider/index.ts",
    Skeleton: "./src/components/Skeleton/index.ts",
    SkeletonText: "./src/components/SkeletonText/index.ts",
    Slider: "./src/components/Slider/index.ts",
    Switch: "./src/components/Switch/index.ts",
    Table: "./src/components/Table/index.ts",
    Tabs: "./src/components/Tabs/index.ts",
    Text: "./src/components/Text/index.ts",
    TextArea: "./src/components/TextArea/index.ts",
    TextField: "./src/components/TextField/index.ts",
    TimeField: "./src/components/TimeField/index.ts",
    Tooltip: "./src/components/Tooltip/index.ts",
    Wrap: "./src/components/Wrap/index.ts",
    globals: "./src/styles/index.ts",
    hooks: "./src/lib/hooks/index.ts",
    nextjs: "./src/integrations/nextjs/index.ts",
    "react-hook-form": "./src/integrations/react-hook-form/index.ts",
  };

  return defineConfig(
    mergeConfig(baseConfig, {
      plugins,
      build: {
        outDir,
        cssCodeSplit,
        lib: {
          entry: entryPoints,
          formats: ["es"],
        },
        rollupOptions: {
          output: {
            assetFileNames: (assetInfo: { name: string }) => {
              if (assetInfo.name === "style.css") {
                return "all.css";
              }
              if (assetInfo.name === "globals.css") {
                return "globals.css";
              }
              return assetInfo.name;
            },
          },
        },
      },
    }),
  );
};
