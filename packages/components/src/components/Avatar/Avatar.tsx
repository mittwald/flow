import React, { FC, PropsWithChildren } from "react";

export const Avatar: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return <>{children}</>;
};

export default Avatar;
