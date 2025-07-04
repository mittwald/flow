import type { ComponentProps, PropsWithChildren } from "react";
import React, { useId } from "react";
import clsx from "clsx";
import styles from "./NavigationGroup.module.scss";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import { Accordion } from "@/components/Accordion";
import { Content } from "@/components/Content";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

export interface NavigationGroupProps
  extends PropsWithChildren<ComponentProps<"section">>,
    FlowComponentProps<HTMLElement> {
  collapsable?: boolean;
}

/** @flr-generate all */
export const NavigationGroup = flowComponent("NavigationGroup", (props) => {
  const { children, className, collapsable, ...rest } = props;

  const rootClassName = clsx(
    styles.navigationGroup,
    collapsable && styles.collapsable,
    className,
  );

  const generatedId = useId();

  const propsContext: PropsContext = {
    Label: {
      id: generatedId,
      className: styles.label,
      "aria-hidden": true,
    },
    Link: {
      tunnelId: "groupLinks",
    },
  };

  if (collapsable) {
    return (
      <PropsContextProvider mergeInParentContext props={propsContext}>
        <TunnelProvider>
          <Accordion defaultExpanded className={rootClassName}>
            {children}
            <Content clearPropsContext={false}>
              <ul>
                <TunnelExit id="groupLinks" />
              </ul>
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
            {children}
            <TunnelExit id="Label" />
            <ul>
              <TunnelExit id="groupLinks" />
            </ul>
          </PropsContextProvider>
        </section>
      </TunnelProvider>
    </PropsContextProvider>
  );
});

export default NavigationGroup;
