import React, { FC, PropsWithChildren } from "react";
import styles from "./Step.module.scss";
import clsx from "clsx";

export interface StepProps extends PropsWithChildren {
  current?: boolean;
  done?: boolean;
}

export const Step: FC<StepProps> = (props) => {
  const { children, current, done } = props;

  const rootClassName = clsx(
    styles.step,
    current && styles.current,
    done && styles.done,
  );

  return <div className={rootClassName}>{children}</div>;
};

export default Step;
