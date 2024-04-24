import type { ComponentProps, FC, PropsWithChildren } from "react";
import React, { useId } from "react";
import clsx from "clsx";
import styles from "./NavigationGroup.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { TunnelExit } from "@mittwald/react-tunnel";
import { Accordion } from "@/components/Accordion";
import { Content } from "@/components/Content";

export interface NavigationGroupProps
  extends PropsWithChildren<ComponentProps<"section">> {
  collapsable?: boolean;
}

export const NavigationGroup: FC<NavigationGroupProps> = (props) => {
  const { children, className, collapsable, ...rest } = props;

  const rootClassName = clsx(styles.navigationGroup, className);

  const generatedId = useId();
  const generatedTunnelId = useId();

  const propsContext: PropsContext = {
    Label: {
      tunnelId: generatedTunnelId,
      id: generatedId,
      className: styles.label,
      "aria-hidden": true,
    },
  };

  if (collapsable) {
    return (
      <Accordion defaultExpanded className={rootClassName}>
        <PropsContextProvider mergeInParentContext props={propsContext}>
          <TunnelExit id={generatedTunnelId} />
          <Content>
            <ul>{children}</ul>
          </Content>
        </PropsContextProvider>
      </Accordion>
    );
  }

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
