import React, { FC, PropsWithChildren } from "react";
import "./Label.module.css";
import * as Aria from "react-aria-components";
import { useProps } from "@/lib/propsContext";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "./locales/*.locale.json";

export interface LabelProps
  extends PropsWithChildren<Omit<Aria.LabelProps, "children">> {
  optional?: boolean;
}

export const Label: FC<LabelProps> = (props) => {
  const { children, className, optional, ...rest } = useProps("Label", props);
  const stringFormatter = useLocalizedStringFormatter(locales);

  const optionalMarker = " " + stringFormatter.format("label.optional");

  return (
    <Aria.Label {...rest} className={className}>
      {children}
      {optional && optionalMarker}
    </Aria.Label>
  );
};

export default Label;
