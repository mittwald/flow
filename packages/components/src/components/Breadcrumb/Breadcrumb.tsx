import React, { FC } from "react";
import * as Aria from "react-aria-components";
import styles from "./Breadcrumb.module.css";
import clsx from "clsx";
import { BreadcrumbItemProps } from "./components/BreadcrumbItem";

export interface BreadcrumbProps
  extends Aria.BreadcrumbsProps<BreadcrumbItemProps> {}

export const Breadcrumb: FC<BreadcrumbProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  return (
    <Aria.Breadcrumbs {...rest} className={rootClassName}>
      {children}
    </Aria.Breadcrumbs>
  );
};

export default Breadcrumb;
