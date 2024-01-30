import { ComponentType } from "react";

declare global {
  declare const LiveCodeEditor: ComponentType<{ example?: string }>;
}
