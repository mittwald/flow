import React, { FC, PropsWithChildren } from "react";
import styles from "./Label.module.css";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { useProps } from "@/lib/propsContext";

export interface LabelProps
  extends PropsWithChildren<Omit<Aria.LabelProps, "children">> {
  optional?: boolean;
}

export const Label: FC<LabelProps> = (props) => {
  const { children, className, ...rest } = useProps("label", props);

  const rootClassName = clsx(className, styles.root);

  return (
    <Aria.Label {...rest} className={rootClassName}>
      {children}
    </Aria.Label>
  );
};

export default Label;
