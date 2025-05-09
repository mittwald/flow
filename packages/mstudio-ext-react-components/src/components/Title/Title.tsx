import { TunnelEntry } from "@mittwald/flow-remote-react-components";
import type { FC, PropsWithChildren } from "react";

/**
 * Overwrite the title of the current page.
 *
 * @example
 *   <Title>My title</Title>;
 */
export const Title: FC<PropsWithChildren> = (props) => (
  <TunnelEntry id="@mstudio-ext/title">{props.children}</TunnelEntry>
);

export default Title;
