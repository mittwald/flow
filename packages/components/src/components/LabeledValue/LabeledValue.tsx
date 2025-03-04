import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithClassName } from "@/lib/types/props";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import clsx from "clsx";
import type { FC, PropsWithChildren } from "react";
import styles from "./LabeledValue.module.scss";

export interface LabeledValueProps
  extends PropsWithChildren,
    PropsWithClassName {}

/** @flr-generate all */
export const LabeledValue: FC<LabeledValueProps> = (props) => {
  const { children, className } = props;

  const rootClassName = clsx(styles.labeledValue, className);

  const propsContext: PropsContext = {
    Label: {
      className: styles.label,
    },
    CopyButton: {
      className: styles.button,
      variant: "plain",
      size: "s",
    },
    Button: {
      className: styles.button,
      variant: "plain",
      size: "s",
    },
    Link: {
      inline: true,
    },
  };

  return (
    <ClearPropsContextView>
      <div className={rootClassName}>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </div>
    </ClearPropsContextView>
  );
};

export default LabeledValue;
