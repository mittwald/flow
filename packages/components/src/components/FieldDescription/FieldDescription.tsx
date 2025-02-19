import React from "react";
import styles from "./FieldDescription.module.scss";
import clsx from "clsx";
import { ClearPropsContext } from "@/lib/propsContext";
import type { TextProps } from "@/components/Text";
import { Text } from "@/components/Text";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface FieldDescriptionProps extends TextProps, FlowComponentProps {}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const FieldDescription = flowComponent("FieldDescription", (props) => {
  const { children, className, ref, ...rest } = props;

  const rootClassName = clsx(styles.fieldDescription, className);

  return (
    <ClearPropsContext>
      <Text slot="description" {...rest} className={rootClassName} ref={ref}>
        {children}
      </Text>
    </ClearPropsContext>
  );
});

export default FieldDescription;
