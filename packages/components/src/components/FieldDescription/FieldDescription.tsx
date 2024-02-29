import React, { FC } from "react";
import styles from "./FieldDescription.module.scss";
import clsx from "clsx";
import { useProps } from "@/lib/propsContext";
import { Text, TextProps } from "@/components/Text";

export interface FieldDescriptionProps extends TextProps {}

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
