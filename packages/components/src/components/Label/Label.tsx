import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Label.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { ClearPropsContext } from "@/lib/propsContext";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "./locales/*.locale.json";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface LabelProps
  extends PropsWithChildren<Omit<Aria.LabelProps, "children">>,
    FlowComponentProps {
  optional?: boolean;
}

export const Label = flowComponent("Label", (props) => {
  const { children, className, optional, ...rest } = props;
  const stringFormatter = useLocalizedStringFormatter(locales);
  const rootClassName = clsx(styles.label, className);

  const optionalMarker = " " + stringFormatter.format("label.optional");

  return (
    <ClearPropsContext>
      <Aria.Label {...rest} className={rootClassName}>
        {children}
        {optional && optionalMarker}
      </Aria.Label>
    </ClearPropsContext>
  );
});

export default Label;
