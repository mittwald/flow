import type { FlowComponentName } from "@/components/propTypes";
import { useSlotContext } from "@/lib/slotContext/slotContext";

export const useContextSlot = (
  component: FlowComponentName,
): string | undefined => useSlotContext()[component];

export default useContextSlot;
