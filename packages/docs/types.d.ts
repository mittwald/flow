import type { ComponentType, PropsWithChildren } from "react";

declare global {
  declare const LiveCodeEditor: ComponentType<{ example?: string }>;
  declare const Do: ComponentType<{ example?: string }>;
  declare const Dont: ComponentType<{ example?: string }>;
  declare const Info: ComponentType<{ example?: string }>;
  declare const Row: ComponentType<PropsWithChildren>;
  declare const Column: ComponentType<PropsWithChildren>;
  declare const StaticModal: ComponentType<PropsWithChildren>;
}
