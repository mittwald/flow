import React, { FC } from "react";
import styles from "./CheckMark.module.css";
import clsx from "clsx";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons/faCheckCircle";
import { Icon, IconProps } from "@/components/Icon";

export const CheckMark: FC<Omit<IconProps, "children" | "faIcon">> = (
  props,
) => {
  const { className, ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  return <Icon {...rest} className={rootClassName} faIcon={faCheckCircle} />;
};

export default CheckMark;
