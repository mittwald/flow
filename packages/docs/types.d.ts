import type { ComponentType, PropsWithChildren } from "react";
import type { LiveCodeEditorProps } from "@/lib/liveCode/components/LiveCodeEditor/LiveCodeEditor";
import type { DoAndDontTileProps } from "@/lib/mdx/components/DoAndDont/DoAndDontTile";

declare global {
  declare const LiveCodeEditor: ComponentType<{
    example?: LiveCodeEditorProps;
  }>;
  declare const Do: ComponentType<DoAndDontTileProps>;
  declare const Dont: ComponentType<DoAndDontTileProps>;
  declare const Info: ComponentType<DoAndDontTileProps>;
  declare const Row: ComponentType<PropsWithChildren>;
  declare const Column: ComponentType<PropsWithChildren>;
  declare const StaticModal: ComponentType<PropsWithChildren>;
}
