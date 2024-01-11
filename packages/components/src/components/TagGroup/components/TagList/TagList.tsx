import React, { FC, PropsWithChildren } from "react";
import styles from "./TagList.module.css";
import { TagProps } from "../Tag";
import * as Aria from "react-aria-components";
import clsx from "clsx";

export interface TagListProps
  extends PropsWithChildren<Omit<Aria.TagListProps<TagProps>, "children">> {}

export const TagList: FC<TagListProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  return (
    <Aria.TagList {...rest} className={rootClassName}>
      {children}
    </Aria.TagList>
  );
};

export default TagList;
