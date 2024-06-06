import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Avatar.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";
import { getVariantFromChildren } from "@/components/Avatar/lib/getVariantFromChildren";
import type { PropsWithClassName } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface AvatarProps
  extends PropsWithChildren,
    PropsWithClassName,
    FlowComponentProps {
  /** @default "m" */
  size?: "xs" | "s" | "m" | "l";
  variant?: 1 | 2 | 3 | 4;
}

export const Avatar = flowComponent("Avatar", (props) => {
  const { children, className, variant, size = "m", refProp: ref } = props;

  const rootClassName = clsx(
    styles.avatar,
    styles[`size-${size}`],
    className,
    styles[`variant-${variant ?? getVariantFromChildren(children)}`],
  );

  const propsContext: PropsContext = {
    Initials: {
      className: styles.initials,
    },
    Icon: {
      className: styles.icon,
    },
  };

  return (
    <ClearPropsContext>
      <div className={rootClassName} ref={ref}>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </div>
    </ClearPropsContext>
  );
});

export default Avatar;
