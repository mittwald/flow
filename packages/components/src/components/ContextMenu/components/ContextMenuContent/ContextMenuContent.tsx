import * as Aria from "react-aria-components";
import type { FC } from "react";

export type ContextMenuContentProps = Aria.MenuProps<object> &
  React.RefAttributes<HTMLDivElement>;

/** @flr-generate all */
export const ContextMenuContent: FC<ContextMenuContentProps> = (props) => (
  <Aria.Menu {...props} />
);

export default ContextMenuContent;
