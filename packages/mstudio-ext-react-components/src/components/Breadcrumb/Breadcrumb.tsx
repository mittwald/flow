import { TunnelEntry } from "@mittwald/flow-remote-react-components";
import type { FC, PropsWithChildren } from "react";

/**
 * Use <Link> children to add items to the breadcrumb.
 *
 * @example
 *   <Breadcrumb>
 *     <Link href="/profiles">Profiles</Link>
 *     <Link href="/profiles/5">Profile</Link>
 *   </Breadcrumb>;
 */
export const Breadcrumb: FC<PropsWithChildren> = (props) => (
  <TunnelEntry id="@mstudio-ext/breadcrumb">{props.children}</TunnelEntry>
);

export default Breadcrumb;
