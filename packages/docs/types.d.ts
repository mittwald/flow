import type { ComponentType, PropsWithChildren } from "react";

declare global {
  declare const LiveCodeEditor: ComponentType<{ example?: string }>;
  declare const Row: ComponentType<PropsWithChildren>;
  declare const Column: ComponentType<PropsWithChildren>;
}
