import type { FC, PropsWithChildren } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./BigNumber.module.scss";
import { PropsContextProvider } from "@/lib/propsContext";
import type { PropsContext } from "@/lib/propsContext";

export type BigNumberProps = PropsWithChildren & PropsWithClassName;

/** @flr-generate all */
export const BigNumber: FC<BigNumberProps> = (props) => {
  const { children, className } = props;

  const rootClassName = clsx(styles.bigNumber, className);

  const propsContext: PropsContext = {
    Text: {
      className: styles.text,
    },
  };

  return (
    <PropsContextProvider props={propsContext} mergeInParentContext>
      <span className={rootClassName}>{children}</span>
    </PropsContextProvider>
  );
};

export default BigNumber;
