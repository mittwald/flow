import React, { FC, PropsWithChildren } from "react";
import styles from "./Radio.module.css";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons/faCheckCircle";
import { Icon } from "@/components/Icon";

export interface RadioProps
  extends PropsWithChildren<Omit<Aria.RadioProps, "children">> {}

export const Radio: FC<RadioProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  const propsContext: PropsContext = {
    Icon: {
      className: styles.icon,
    },
    Text: {
      className: styles.label,
    },
    Content: {
      className: styles.content,
    },
  };

  return (
    <Aria.Radio {...rest} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
      <Icon className={styles.checkmark} faIcon={faCheckCircle} />
    </Aria.Radio>
  );
};

export default Radio;
