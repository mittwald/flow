import type { PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./Breadcrumb.module.scss";
import clsx from "clsx";
import type { BreadcrumbItemProps } from "./components/BreadcrumbItem";
import { BreadcrumbItem } from "./components/BreadcrumbItem";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { type AlphaColor, isAlphaColor } from "@/lib/types/props";
import { useSkeletonMode } from "@/components/SkeletonMode/skeletonModeContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface BreadcrumbProps
  extends
    Omit<Aria.BreadcrumbsProps<BreadcrumbItemProps>, "children">,
    PropsWithChildren,
    FlowComponentProps<HTMLOListElement> {
  /** The color of the breadcrumb. @default "default" */
  color?: "default" | AlphaColor;
  /** The size of the element. @default "m" */
  size?: "s" | "m";
}

/** @flr-generate all */
export const Breadcrumb = flowComponent("Breadcrumb", (props) => {
  const {
    children,
    className,
    color = "default",
    size = "m",
    ref,
    ...rest
  } = props;

  const isSkeleton = useSkeletonMode();

  const rootClassName = clsx(
    styles.breadcrumb,
    isAlphaColor(color) && styles[color],
    size === "s" && styles["size-s"],
    isSkeleton && styles.skeleton,
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
    <Aria.Breadcrumbs {...rest} ref={ref} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </Aria.Breadcrumbs>
  );
});

export default Breadcrumb;
