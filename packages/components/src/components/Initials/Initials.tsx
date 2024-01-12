import React, { FC, PropsWithChildren } from "react";

export const Initials: FC<PropsWithChildren<{ children: string }>> = (
  props,
) => {
  const { children } = props;

  return <>{children}</>;
};

export default Initials;
