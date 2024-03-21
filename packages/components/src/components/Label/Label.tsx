import React, { FC, PropsWithChildren } from "react";
import styles from "./Label.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { ClearPropsContext, useProps } from "@/lib/propsContext";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "./locales/*.locale.json";

export interface LabelProps
  extends PropsWithChildren<Omit<Aria.LabelProps, "children">> {
  optional?: boolean;
}

export const Label: FC<LabelProps> = (props) => {
  const { children, className, optional, ...rest } = useProps("Label", props);
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
};

export default Label;
