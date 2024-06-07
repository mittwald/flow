import type { FC } from "react";
import React from "react";
import type { PopoverProps } from "@/components/Popover";
import { Popover } from "@/components/Popover";
import styles from "./ContextualHelp.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";

export type ContextualHelpProps = Omit<PopoverProps, "withTip">;

export const ContextualHelp: FC<ContextualHelpProps> = (props) => {
  const { children, ...rest } = props;

  const propsContext: PropsContext = {
    Heading: {
      level: 5,
    },
  };

  return (
    <Popover withTip {...rest}>
      <PropsContextProvider props={propsContext}>
        <div className={styles.contextualHelp}>{children}</div>
      </PropsContextProvider>
    </Popover>
  );
};

export default ContextualHelp;
