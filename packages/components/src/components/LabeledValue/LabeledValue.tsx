import { type PropsWithChildren, useId } from "react";
import styles from "./LabeledValue.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithClassName } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface LabeledValueProps
  extends PropsWithChildren, PropsWithClassName, FlowComponentProps {}

/** @flr-generate all */
export const LabeledValue = flowComponent(
  "LabeledValue",
  (props) => {
    const { children, className, ref } = props;

    const rootClassName = clsx(styles.labeledValue, className);

    const labelId = useId();

    const propsContext: PropsContext = {
      Label: {
        className: styles.label,
        elementType: "span",
        id: labelId,
      },
      CopyButton: {
        className: styles.button,
        variant: "plain",
        size: "s",
      },
      Button: {
        className: styles.button,
        size: "s",
      },
      Link: {
        inline: true,
      },
    };

    return (
      <div
        ref={ref}
        className={rootClassName}
        role="group"
        aria-labelledby={labelId}
      >
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </div>
    );
  },
  { type: "layout" },
);

export default LabeledValue;
