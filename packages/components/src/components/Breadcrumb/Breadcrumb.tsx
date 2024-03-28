import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./Breadcrumb.module.scss";
import clsx from "clsx";
import {
  BreadcrumbItem,
  BreadcrumbItemProps,
} from "./components/BreadcrumbItem";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";

export interface BreadcrumbProps
  extends Omit<Aria.BreadcrumbsProps<BreadcrumbItemProps>, "children">,
    PropsWithChildren {}

export const Breadcrumb: FC<BreadcrumbProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.breadcrumb, className);

  const propsContext: PropsContext = {
    Link: {
      unstyled: true,
      className: styles.link,
      hoc: (link) => <BreadcrumbItem>{link}</BreadcrumbItem>,
    },
  };

  return (
    <Aria.Breadcrumbs {...rest} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </Aria.Breadcrumbs>
  );
};

export default Breadcrumb;
