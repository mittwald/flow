import React, { FC, PropsWithChildren, ReactNode } from "react";
import styles from "./Radio.module.css";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import Text from "@/components/Text/Text";

export interface RadioProps
  extends PropsWithChildren<Omit<Aria.RadioProps, "children">> {
  description?: ReactNode;
}

export const Radio: FC<RadioProps> = (props) => {
  const { children, description, className, ...rest } = props;

  const rootClassName = clsx(className, styles.radio);

  return (
    <Aria.Radio {...rest} className={rootClassName}>
      <Aria.Label>{children}</Aria.Label>
      {description && <Text slot="description">{description}</Text>}
    </Aria.Radio>
  );
};

export default Radio;
