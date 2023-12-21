import React, { FC, PropsWithChildren } from "react";
import styles from "./Label.module.css";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { useProps } from "@/lib/propsContext";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "./locales/*.locale.json";

export interface LabelProps
  extends PropsWithChildren<Omit<Aria.LabelProps, "children">> {
  optional?: boolean;
}

export const Label: FC<LabelProps> = (props) => {
  const { children, className, optional, ...rest } = useProps("label", props);

  const rootClassName = clsx(className, styles.root);

  const optionalMarker = ` ${useLocalizedStringFormatter(locales).format(
    "label.optional",
  )}`;

  return (
    <Aria.Label {...rest} className={rootClassName}>
      {children}
      {optional && optionalMarker}
    </Aria.Label>
  );
};

export default Label;
