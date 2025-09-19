import styles from "./FieldDescription.module.scss";
import clsx from "clsx";
import type { TextProps } from "@/components/Text";
import { Text } from "@/components/Text";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface FieldDescriptionProps extends TextProps, FlowComponentProps {}

/** @flr-generate all */
export const FieldDescription = flowComponent("FieldDescription", (props) => {
  const { children, className, ref, ...rest } = props;

  const rootClassName = clsx(styles.fieldDescription, className);

  return (
    <Text slot="description" {...rest} className={rootClassName} ref={ref}>
      {children}
    </Text>
  );
});

export default FieldDescription;
