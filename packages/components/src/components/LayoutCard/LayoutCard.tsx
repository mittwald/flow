import type { PropsWithChildren } from "react";
import styles from "./LayoutCard.module.scss";
import clsx from "clsx";
import type { PropsWithElementType } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";

export interface LayoutCardProps
  extends PropsWithChildren,
    PropsWithElementType<"div" | "main" | "footer" | "header">,
    FlowComponentProps {}

/** @flr-generate all */
export const LayoutCard = flowComponent("LayoutCard", (props) => {
  const { children, className, elementType = "div", ref, ...rest } = props;

  const rootClassName = clsx(styles.layoutCard, className);

  const Element = elementType;

  const propsContext: PropsContext = {
    Tabs: {
      className: styles.tabs,
    },
    AccentBox: { className: styles.accentBox },
  };

  return (
    <Element className={rootClassName} {...rest} ref={ref}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </Element>
  );
});

export default LayoutCard;
