import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsContext } from "@/lib/propsContext";
import PropsContextProvider from "@/lib/propsContext/PropsContextProvider";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import styles from "./Align.module.scss";

export interface AlignProps
  extends PropsWithChildren,
    PropsWithClassName,
    FlowComponentProps {}

/** @flr-generate all */
export const Align = flowComponent("Align", (props) => {
  const { children, className } = props;

  const rootClassName = clsx(styles.align, className);

  const propsContext: PropsContext = {
    Text: { className: styles.text },
    Button: { className: styles.button },
    Avatar: { className: styles.avatar, size: "m" },
    CopyButton: { size: "s", className: styles.copyButton },
    Icon: { size: "s", className: styles.icon },
    ContextualHelpTrigger: {
      Button: {
        className: styles.contextualHelpTriggerButton,
      },
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <div className={rootClassName}>{children}</div>
    </PropsContextProvider>
  );
});

export default Align;
