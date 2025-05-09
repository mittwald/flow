import React, { createElement, type FC, type PropsWithChildren } from "react";

export const SlotRootWrapper: FC<PropsWithChildren> = (props) => {
  return createElement(React.Fragment, {}, props.children);
};

export default SlotRootWrapper;
