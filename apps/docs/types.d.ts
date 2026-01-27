import type { ComponentType, PropsWithChildren } from "react";
import type { LiveCodeEditorProps } from "@/lib/liveCode/components/LiveCodeEditor/LiveCodeEditor";
import type { DoAndDontTileProps } from "@/lib/mdx/components/DoAndDont/ExampleTile";

interface DoAndDontProps extends Omit<
  DoAndDontTileProps,
  "code" | "type" | "text"
> {
  example?: string;
  exampleText?: string;
}

declare global {
  declare const LiveCodeEditor: ComponentType<{
    example?: LiveCodeEditorProps;
  }>;
  declare const Do: ComponentType<DoAndDontProps>;
  declare const Dont: ComponentType<DoAndDontProps>;
  declare const Info: ComponentType<DoAndDontProps>;
  declare const Row: ComponentType<PropsWithChildren>;
  declare const PropertiesTables: ComponentType;
  declare const Column: ComponentType<PropsWithChildren>;
  declare const StaticModal: ComponentType<PropsWithChildren>;
}
