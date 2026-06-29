import { type FC, type PropsWithChildren, useId } from "react";
import styles from "./LabeledValue.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithClassName } from "@/lib/types/props";

export interface LabeledValueProps
  extends PropsWithChildren, PropsWithClassName {}

/** @flr-generate all */
export const LabeledValue: FC<LabeledValueProps> = (props) => {
  const { children, className } = props;

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
    <div className={rootClassName} role="group" aria-labelledby={labelId}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </div>
  );
};

export default LabeledValue;
