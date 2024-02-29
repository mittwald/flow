import React, { FC, PropsWithChildren } from "react";
import styles from "./TagList.module.scss";
import { TagProps } from "../Tag";
import * as Aria from "react-aria-components";
import clsx from "clsx";

export interface TagListProps
  extends Aria.TagListProps<TagProps>{}

export const TagList: FC<TagListProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.tagList,className);

  return (
    <Aria.TagList {...rest} className={rootClassName}>
      {children}
    </Aria.TagList>
  );
};

export default TagList;
