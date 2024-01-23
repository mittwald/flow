import React, { FC, PropsWithChildren } from "react";
import styles from "./FieldDescription.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { useProps } from "@/lib/propsContext";
import { Text } from "@/components/Text";

export interface FieldDescriptionProps
  extends PropsWithChildren<Omit<Aria.TextProps, "children" | "slot">> {}

export const FieldDescription: FC<FieldDescriptionProps> = (props) => {
  const { children, className, ...rest } = useProps("FieldDescription", props);

  const rootClassName = clsx(styles.fieldDescription, className);

  return (
    <Text slot="description" {...rest} className={rootClassName}>
      {children}
    </Text>
  );
};

export default FieldDescription;
