import { createContext, useContext } from "react";
import type { SlotContext } from "@/lib/slotContext/types";

export const slotContext = createContext<SlotContext>({});

export const useSlotContext = (): SlotContext => useContext(slotContext);
