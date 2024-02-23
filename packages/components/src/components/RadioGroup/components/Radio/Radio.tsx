import React, { FC, PropsWithChildren } from "react";
import styles from "./Radio.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { Icon } from "@/components/Icon";
import { IconCheck } from "@tabler/icons-react";

export interface RadioProps
  extends PropsWithChildren<Omit<Aria.RadioProps, "children">> {}

export const Radio: FC<RadioProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.radio, className);

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
      <Icon className={styles.checkmark} tablerIcon={<IconCheck />} />
    </Aria.Radio>
  );
};

export default Radio;
