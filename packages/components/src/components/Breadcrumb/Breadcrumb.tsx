import type { FC, PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import styles from "./Breadcrumb.module.scss";
import clsx from "clsx";
import type { BreadcrumbItemProps } from "./components/BreadcrumbItem";
import { BreadcrumbItem } from "./components/BreadcrumbItem";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";

export interface BreadcrumbProps
  extends Omit<Aria.BreadcrumbsProps<BreadcrumbItemProps>, "children">,
    PropsWithChildren {
  /** @default "primary" */
  color?: "primary" | "static-black" | "static-white";
}

export const Breadcrumb: FC<BreadcrumbProps> = (props) => {
  const { children, className, color = "primary", ...rest } = props;

  const rootClassName = clsx(styles.breadcrumb, styles[color], className);

  const propsContext: PropsContext = {
    Link: {
      render: (Link, props) => (
        <BreadcrumbItem>
          <Link {...props} unstyled className={styles.link} />
        </BreadcrumbItem>
      ),
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
