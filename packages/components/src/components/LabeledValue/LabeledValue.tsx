import { useId, type PropsWithChildren, type FC } from "react";
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

  const generatedId = useId();

  const propsContext: PropsContext = {
    Label: {
      className: styles.label,
      elementType: "span",
      id: generatedId,
    },
    CopyButton: {
      className: styles.button,
      variant: "plain",
      size: "s",
      "aria-describedby": generatedId,
    },
    Button: {
      className: styles.button,
      size: "s",
      "aria-describedby": generatedId,
    },
    Link: {
      inline: true,
      "aria-describedby": generatedId,
    },
  };

  return (
    <div className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </div>
  );
};

export default LabeledValue;
