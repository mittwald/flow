import type { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./Breadcrumb.module.scss";
import clsx from "clsx";
import type { BreadcrumbItemProps } from "./components/BreadcrumbItem";
import { BreadcrumbItem } from "./components/BreadcrumbItem";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";

export interface BreadcrumbProps
  extends
    Omit<Aria.BreadcrumbsProps<BreadcrumbItemProps>, "children">,
    PropsWithChildren {
  /** The color of the breadcrumb. */
  color?: "default" | "dark" | "light";
  /** The size of the element. @default "m" */
  size?: "s" | "m";
}

/** @flr-generate all */
export const Breadcrumb: FC<BreadcrumbProps> = (props) => {
  const { children, className, color, size = "m", ...rest } = props;

  const rootClassName = clsx(
    styles.breadcrumb,
    (color === "light" || color === "dark") && styles[color],
    size === "s" && styles["size-s"],
    className,
  );

  const propsContext: PropsContext = {
    Link: {
      unstyled: true,
      className: styles.link,
      wrapWith: <BreadcrumbItem />,
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
