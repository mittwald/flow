"use client";
import type { FC, PropsWithChildren } from "react";
import { createContext, useContext, useMemo, useState } from "react";

interface GroupExpansionState {
  /**
   * `null` until the user toggles: groups then follow the active page instead
   * of a global expanded state.
   */
  expandAll: boolean | null;
  /** Changes on every toggle, so groups re-apply the default they already had. */
  nonce: number;
}

interface GroupExpansion extends GroupExpansionState {
  toggle: () => void;
}

const groupExpansionContext = createContext<GroupExpansion | undefined>(
  undefined,
);

/**
 * Manages the expanded/collapsed default of the navigation groups it wraps.
 * Groups outside a provider keep the `NavigationGroup` default (expanded).
 */
export const GroupExpansionProvider: FC<PropsWithChildren> = (props) => {
  const [state, setState] = useState<GroupExpansionState>({
    expandAll: null,
    nonce: 0,
  });

  const value = useMemo(
    () => ({
      ...state,
      toggle: () =>
        setState((state) => ({
          expandAll: !state.expandAll,
          nonce: state.nonce + 1,
        })),
    }),
    [state],
  );

  return (
    <groupExpansionContext.Provider value={value}>
      {props.children}
    </groupExpansionContext.Provider>
  );
};

export const useGroupExpansion = () => useContext(groupExpansionContext);
