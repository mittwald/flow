import { createContext, useContext } from "react";
import type { Key } from "react-aria-components";

export interface AccordionGroupContextValue {
  isExpanded: (key: Key, isDefaultExpanded: boolean) => boolean;
  setExpanded: (key: Key, isExpanded: boolean) => void;
  /** Registers an accordion for `onExpandedChange`; returns the cleanup. */
  register: (key: Key, isDefaultExpanded: boolean) => () => void;
}

export const AccordionGroupContext =
  createContext<AccordionGroupContextValue | null>(null);

export const useAccordionGroupContext = () => useContext(AccordionGroupContext);
