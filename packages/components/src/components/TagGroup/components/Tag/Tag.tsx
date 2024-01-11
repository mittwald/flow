import React, { FC, PropsWithChildren } from "react";
import styles from "./Tag.module.css";
import * as Aria from "react-aria-components";
import clsx from "clsx";

export interface TagProps
  extends PropsWithChildren<Omit<Aria.TagProps, "children">> {}

export const Tag: FC<TagProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  return (
    <Aria.Tag {...rest} className={rootClassName}>
      {children}
    </Aria.Tag>
  );
};

export default Tag;
