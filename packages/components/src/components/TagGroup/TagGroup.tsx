import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./TagGroup.module.css";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";

export interface TagGroupProps
  extends PropsWithChildren<Omit<Aria.TagGroupProps, "children">> {}

export const TagGroup: FC<TagGroupProps> = (props) => {
  const { children, className, selectionMode = "multiple", ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  const propsContext: PropsContext = {
    label: {
      className: styles.label,
    },
  };

  return (
    <Aria.TagGroup
      {...rest}
      selectionMode={selectionMode}
      className={rootClassName}
    >
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </Aria.TagGroup>
  );
};

export default TagGroup;
