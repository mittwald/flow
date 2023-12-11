import React, { FC } from "react";
import styles from "./Description.module.css";
import clsx from "clsx";
import { Text, TextProps } from "@/components";

export const Description: FC<TextProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  return (
    <Text {...rest} className={rootClassName}>
      {children}
    </Text>
  );
};

export default Description;
