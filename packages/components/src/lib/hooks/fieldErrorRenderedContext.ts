import { createContext } from "react";

/**
 * Lets a rendered `FieldError` tell its field which id it has, so the field
 * references the error only while it exists. `undefined` reports that it is
 * gone.
 *
 * @internal
 */
export const FieldErrorRenderedContext = createContext<
  ((fieldErrorId: string | undefined) => void) | undefined
>(undefined);
