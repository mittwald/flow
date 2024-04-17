import type { ComponentProps, FC, PropsWithChildren } from "react";
import { useId } from "react";
import React from "react";
import clsx from "clsx";
import styles from "./NavigationGroup.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { TunnelExit } from "@mittwald/react-tunnel";

export interface NavigationGroupProps
  extends PropsWithChildren<ComponentProps<"section">> {}

export const NavigationGroup: FC<NavigationGroupProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.navigationGroup, className);

  const generatedId = useId();
  const generatedTunnelId = useId();

  const propsContext: PropsContext = {
    Label: {
      tunnelId: generatedTunnelId,
      id: generatedId,
      className: styles.label,
    },
  };

  return (
    <section aria-labelledby={generatedId} className={rootClassName} {...rest}>
      <PropsContextProvider mergeInParentContext props={propsContext}>
        <TunnelExit id={generatedTunnelId} />
        <ul>{children}</ul>
      </PropsContextProvider>
    </section>
  );
};

export default NavigationGroup;
