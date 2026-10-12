import { createContext, useContext } from "react";

/** The id of the heading of the surrounding `Section`. */
const sectionHeadingIdContext = createContext<string | undefined>(undefined);

export const SectionHeadingIdProvider = sectionHeadingIdContext.Provider;

/**
 * The `aria-labelledby` of a grid or table: its own label, else the heading of
 * the surrounding `Section`.
 */
export const useLabelledBySectionHeading = (props: {
  "aria-label"?: string;
  "aria-labelledby"?: string;
}): string | undefined => {
  const sectionHeadingId = useContext(sectionHeadingIdContext);

  if (props["aria-labelledby"] || props["aria-label"]) {
    return props["aria-labelledby"];
  }

  return sectionHeadingId;
};
