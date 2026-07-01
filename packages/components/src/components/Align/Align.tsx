import type { PropsWithChildren } from "react";
import styles from "./Align.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithClassName } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface AlignProps
  extends PropsWithChildren, PropsWithClassName, FlowComponentProps {
  id?: string;
}

/** @flr-generate all */
export const Align = flowComponent(
  "Align",
  (props) => {
    const { children, className, id } = props;

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
        <div className={rootClassName} id={id}>
          {children}
        </div>
      </PropsContextProvider>
    );
  },
  {
    type: "layout",
  },
);

export default Align;
