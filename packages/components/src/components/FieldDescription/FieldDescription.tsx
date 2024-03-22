import React from "react";
import styles from "./FieldDescription.module.scss";
import clsx from "clsx";
import { ClearPropsContext } from "@/lib/propsContext";
import { Text, TextProps } from "@/components/Text";
import {
  flowComponent,
  FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

export interface FieldDescriptionProps extends TextProps, FlowComponentProps {}

export const FieldDescription = flowComponent("FieldDescription", (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.fieldDescription, className);

  return (
    <ClearPropsContext>
      <Text slot="description" {...rest} className={rootClassName}>
        {children}
      </Text>
    </ClearPropsContext>
  );
});

export default FieldDescription;
