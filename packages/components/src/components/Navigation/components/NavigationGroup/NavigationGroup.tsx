import type { ComponentProps, FC, PropsWithChildren } from "react";
import React, { useId } from "react";
import clsx from "clsx";
import styles from "./NavigationGroup.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
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

  const propsContext: PropsContext = {
    Label: {
      tunnelId: "Label",
      id: generatedId,
      className: styles.label,
      "aria-hidden": true,
    },
  };

  if (collapsable) {
    return (
      <PropsContextProvider mergeInParentContext props={propsContext}>
        <TunnelProvider>
          <Accordion defaultExpanded className={rootClassName}>
            <TunnelExit id="label" />
            <Content clearPropsContext={false}>
              <ul>{children}</ul>
            </Content>
          </Accordion>
        </TunnelProvider>
      </PropsContextProvider>
    );
  }

  return (
    <PropsContextProvider mergeInParentContext props={propsContext}>
    <TunnelProvider>
      <section
        aria-labelledby={generatedId}
        className={rootClassName}
        {...rest}
      >
        <PropsContextProvider mergeInParentContext props={propsContext}>
          <TunnelExit id="Label" />
          <ul>{children}</ul>
        </PropsContextProvider>
      </section>
    </TunnelProvider>
    </PropsContextProvider>
  );
};

export default NavigationGroup;
