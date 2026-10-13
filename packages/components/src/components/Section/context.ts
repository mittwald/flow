import type { FC, PropsWithChildren } from "react";
import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

interface SectionHeading {
  /** The id the surrounding `Section` gives its heading. */
  id: string;
  /** Whether a heading currently renders with that id. */
  isRendered: boolean;
  /** Called by a heading that renders with the id; returns the cleanup. */
  register: () => () => void;
}

const sectionHeadingContext = createContext<SectionHeading | undefined>(
  undefined,
);

/** The heading state a `Section` provides for the given heading id. */
export const useSectionHeading = (id: string): SectionHeading => {
  const [renderedCount, setRenderedCount] = useState(0);

  const register = useCallback(() => {
    setRenderedCount((count) => count + 1);
    return () => setRenderedCount((count) => count - 1);
  }, []);

  return useMemo(
    () => ({ id, isRendered: renderedCount > 0, register }),
    [id, renderedCount, register],
  );
};

export const SectionHeadingProvider = sectionHeadingContext.Provider;

/**
 * Ends the surrounding `Section`'s heading scope, for content that has a
 * heading of its own (`Accordion`, `Alert`, an overlay, …).
 */
export const SectionHeadingReset: FC<PropsWithChildren> = ({ children }) =>
  createElement(sectionHeadingContext.Provider, { value: undefined }, children);

/** Marks the section heading as rendered while a heading carries its id. */
export const useRegisterSectionHeading = (id: string | undefined) => {
  const sectionHeading = useContext(sectionHeadingContext);
  const register =
    sectionHeading && id === sectionHeading.id
      ? sectionHeading.register
      : undefined;

  useLayoutEffect(() => register?.(), [register]);
};

/**
 * The `aria-labelledby` of a grid or table: its own label, else the heading of
 * the surrounding `Section` once that heading renders.
 */
export const useLabelledBySectionHeading = (props: {
  "aria-label"?: string;
  "aria-labelledby"?: string;
}): string | undefined => {
  const sectionHeading = useContext(sectionHeadingContext);

  if (props["aria-labelledby"] || props["aria-label"]) {
    return props["aria-labelledby"];
  }

  return sectionHeading?.isRendered ? sectionHeading.id : undefined;
};
