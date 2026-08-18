"use client";
import type { FC, PropsWithChildren } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

interface GroupExpansionState {
  /** `null` until the user toggles. */
  expandAll: boolean | null;
  /** Pathname the toggle was pressed on. */
  togglePathname: string | null;
  /** Changes on every toggle, so groups re-apply the default they already had. */
  nonce: number;
}

interface GroupExpansion {
  nonce: number;
  toggle: () => void;
  expandAll: boolean | null;
  getDefaultExpanded: (containsActivePage: boolean) => boolean;
}

const groupExpansionContext = createContext<GroupExpansion | undefined>(
  undefined,
);

export const GroupExpansionProvider: FC<PropsWithChildren> = (props) => {
  const currentPathname = usePathname();
  const [state, setState] = useState<GroupExpansionState>({
    expandAll: null,
    togglePathname: null,
    nonce: 0,
  });

  const value = useMemo(
    () => ({
      nonce: state.nonce,
      expandAll: state.expandAll,

      toggle: () =>
        setState((state) => ({
          expandAll: !state.expandAll,
          togglePathname: currentPathname,
          nonce: state.nonce + 1,
        })),

      // The group of the active page opens on navigation, even after "collapse
      // all" — that toggle only applies on the page it was pressed on.
      getDefaultExpanded: (containsActivePage: boolean) =>
        containsActivePage && currentPathname !== state.togglePathname
          ? true
          : (state.expandAll ?? containsActivePage),
    }),
    [state, currentPathname],
  );

  return (
    <groupExpansionContext.Provider value={value}>
      {props.children}
    </groupExpansionContext.Provider>
  );
};

export const useGroupExpansion = () => useContext(groupExpansionContext);
