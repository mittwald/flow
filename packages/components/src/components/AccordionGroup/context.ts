import { createContext, useContext } from "react";

export interface AccordionGroupContextValue {
  isExpanded: (key: string, isDefaultExpanded: boolean) => boolean;
  setExpanded: (key: string, isExpanded: boolean) => void;
  /** Registers an accordion for `onExpandedChange`; returns the cleanup. */
  register: (key: string, isDefaultExpanded: boolean) => () => void;
}

export const AccordionGroupContext =
  createContext<AccordionGroupContextValue | null>(null);

export const useAccordionGroupContext = () => useContext(AccordionGroupContext);
