import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./TagGroup.module.css";
import clsx from "clsx";

export interface TagGroupProps
  extends PropsWithChildren<Omit<Aria.TagGroupProps, "children">> {}

export const TagGroup: FC<TagGroupProps> = (props) => {
  const { children, className, selectionMode = "multiple", ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  return (
    <Aria.TagGroup
      {...rest}
      selectionMode={selectionMode}
      className={rootClassName}
    >
      {children}
    </Aria.TagGroup>
  );
};

export default TagGroup;
