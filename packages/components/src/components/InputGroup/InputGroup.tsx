import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./InputGroup.module.css";
import { useProps } from "@/lib/propsContext";
import clsx from "clsx";

export interface InputGroupProps extends PropsWithChildren {
  className?: string;
}

export const InputGroup: FC<InputGroupProps> = (props) => {
  const { children, className } = useProps("inputGroup", props);

  const rootClassName = clsx(className, styles.root);

  return <Aria.Group className={rootClassName}>{children}</Aria.Group>;
};

export default InputGroup;
