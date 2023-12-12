import React, { FC, PropsWithChildren } from "react";
import styles from "./Radio.module.css";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { CheckMark } from "@/components/CheckMark";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";

export interface RadioProps
  extends PropsWithChildren<Omit<Aria.RadioProps, "children">> {}

export const Radio: FC<RadioProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  const propsContext: PropsContext = {
    icon: {
      className: styles.icon,
    },
    text: {
      className: styles.label,
    },
  };

  return (
    <Aria.Radio {...rest} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
      <CheckMark />
    </Aria.Radio>
  );
};

export default Radio;
