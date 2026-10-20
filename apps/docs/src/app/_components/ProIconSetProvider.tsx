"use client";
import { proIconSet } from "@mittwald/flow-icons-pro";
import { IconSetProvider } from "@mittwald/flow-react-components";
import type { FC, PropsWithChildren } from "react";

/**
 * Renders the Styleguide with FontAwesome Pro icons. Without them installed
 * (see `dev/installProIcons.ts`), `next.config.js` swaps the package for
 * `withoutProIcons/iconsPro.ts`, `proIconSet` is `undefined` and the default
 * icons stay.
 *
 * A client component because an icon set is a map of components, which a server
 * component cannot pass as a prop.
 */
export const ProIconSetProvider: FC<PropsWithChildren> = (props) => (
  <IconSetProvider set={proIconSet}>{props.children}</IconSetProvider>
);
