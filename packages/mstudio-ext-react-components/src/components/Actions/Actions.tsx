import { TunnelEntry } from "@mittwald/flow-remote-react-components";
import type { FC, PropsWithChildren } from "react";

/**
 * Use <MenuItem> children to add items to the actions menu.
 *
 * @example
 *   <Actions>
 *     <MenuItem onAction={onRename}>Rename</MenuItem>
 *     <MenuItem onAction={onDelete}>Delete</MenuItem>
 *   </Actions>;
 */
export const Actions: FC<PropsWithChildren> = (props) => (
  <TunnelEntry id="@mstudio-ext/actions">{props.children}</TunnelEntry>
);

export default Actions;
