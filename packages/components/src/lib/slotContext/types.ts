import type { FlowComponentName } from "@/components/propTypes";

export type SlotContext = Partial<{
  [C in FlowComponentName]: string;
}>;
