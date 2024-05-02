import type { ComponentProps, FC, PropsWithChildren } from "react";
import React, { useId } from "react";
import clsx from "clsx";
import styles from "./NavigationGroup.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";

export interface NavigationGroupProps
  extends PropsWithChildren<ComponentProps<"section">> {}

export const NavigationGroup: FC<NavigationGroupProps> = (props) => {
  const { children, className, ...rest } = props;

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

  return (
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
  );
};

export default NavigationGroup;
