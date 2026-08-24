import type { FC, PropsWithChildren } from "react";
import styles from "./Combine.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithClassName } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface CombineProps
  extends PropsWithChildren, PropsWithClassName, FlowComponentProps {}

/**
 * The arrangement itself, shared with the deprecated `Align` alias so both
 * names render the exact same output.
 */
export const CombineImplementation: FC<CombineProps> = (props) => {
  const { children, className } = props;

  const rootClassName = clsx(styles.combine, className);

  const propsContext: PropsContext = {
    Text: { className: styles.text },
    Button: { className: styles.button },
    Avatar: { className: styles.avatar, size: "m" },
    CopyButton: { size: "s", className: styles.copyButton },
    Icon: { size: "s", className: styles.icon, color: "neutral" },
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
};

/** @flr-generate all */
export const Combine = flowComponent("Combine", CombineImplementation, {
  type: "layout",
});

export default Combine;
