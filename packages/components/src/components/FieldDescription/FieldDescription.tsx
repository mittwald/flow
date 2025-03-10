import type { TextProps } from "@/components/Text";
import { Text } from "@/components/Text";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import clsx from "clsx";
import styles from "./FieldDescription.module.scss";

export interface FieldDescriptionProps extends TextProps, FlowComponentProps {}

/** @flr-generate all */
export const FieldDescription = flowComponent("FieldDescription", (props) => {
  const { children, className, ref, ...rest } = props;

  const rootClassName = clsx(styles.fieldDescription, className);

  return (
    <ClearPropsContextView>
      <Text slot="description" {...rest} className={rootClassName} ref={ref}>
        {children}
      </Text>
    </ClearPropsContextView>
  );
});

export default FieldDescription;
