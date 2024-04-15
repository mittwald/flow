import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./SegmentedGroup.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import formFieldStyles from "../../../FormField/FormField.module.scss";
import { IconCheck } from "@/components/Icon/components/icons";

interface Props extends PropsWithChildren {}

export const SegmentedGroup: FC<Props> = (props) => {
  const { children } = props;

  const rootClassName = clsx(styles.segmentedGroup, formFieldStyles.formField);

  const propsContext: PropsContext = {
    Radio: {
      className: styles.segment,
      unstyled: true,
      children: dynamic((props) => (
        <>
          {props.children}
          <IconCheck className={styles.checkmark} />
        </>
      )),
    },
  };

  return (
    <div className={rootClassName}>
      <PropsContextProvider props={propsContext} mergeInParentContext>
        <div className={styles.segments}>{children}</div>
      </PropsContextProvider>
    </div>
  );
};

export default SegmentedGroup;
