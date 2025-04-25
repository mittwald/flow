import React, { createElement } from "react";
import type { FC, PropsWithChildren } from "react";

export const SlotRootWrapper: FC<PropsWithChildren> = (props) => {
  return createElement(React.Fragment, {}, props.children);
};

export default SlotRootWrapper;
