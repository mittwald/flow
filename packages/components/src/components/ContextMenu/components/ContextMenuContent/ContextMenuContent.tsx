import * as Aria from "react-aria-components";
import type { ComponentProps, FC } from "react";

export type ContextMenuContentProps = ComponentProps<typeof Aria.Menu>;

/** @flr-generate all */
export const ContextMenuContent: FC<ContextMenuContentProps> = (props) => (
  <Aria.Menu {...props} />
);

export default ContextMenuContent;
