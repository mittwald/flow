import React, { ComponentProps, FC, PropsWithChildren } from "react";
import styles from "./ButtonGroup.module.scss";
import { useProps } from "@/lib/propsContext";
import clsx from "clsx";

export interface ButtonGroupProps
  extends PropsWithChildren<ComponentProps<"div">> {}

export const ButtonGroup: FC<ButtonGroupProps> = (props) => {
  const { children, className, ...rest } = useProps("ButtonGroup", props);

  const rootClassName = clsx(styles.buttonGroup, className);

  return (
    <div {...rest} className={rootClassName}>
      {children}
    </div>
  );
};

export default ButtonGroup;
