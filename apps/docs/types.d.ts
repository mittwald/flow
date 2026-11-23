/// <reference types="next" />
/// <reference types="next/image-types/global" />

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
  const LiveCodeEditor: ComponentType<{
    example?: LiveCodeEditorProps;
  }>;
  const Do: ComponentType<DoAndDontProps>;
  const Dont: ComponentType<DoAndDontProps>;
  const Info: ComponentType<DoAndDontProps>;
  const Row: ComponentType<PropsWithChildren>;
  const PropertiesTables: ComponentType;
  const ComponentTokenTable: ComponentType<{ tokens?: string }>;
  const Column: ComponentType<PropsWithChildren>;
}
