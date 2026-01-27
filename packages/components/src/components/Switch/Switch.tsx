import { type PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./Switch.module.scss";
import clsx from "clsx";
import { IconCheck, IconClose } from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import labelStyles from "../Label/Label.module.scss";
import { useObjectRef } from "react-aria";

export interface SwitchProps
  extends
    PropsWithChildren<Omit<Aria.SwitchProps, "children" | "inputRef">>,
    FlowComponentProps<HTMLInputElement> {
  /**
   * Whether the label should appear before or after the switch. @default
   * "trailing"
   */
  labelPosition?: "leading" | "trailing";
}

/** @flr-generate all */
export const Switch = flowComponent("Switch", (props) => {
  const {
    children,
    className,
    labelPosition = "trailing",
    ref,
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.switch,
    className,
    styles[`label-${labelPosition}`],
  );

  const objectRef = useObjectRef(ref);

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldPropsContext,
    fieldProps,
  } = useFieldComponent(props);

  const propsContext: PropsContext = {
    ...fieldPropsContext,
    Label: {
      ...fieldPropsContext.Label,
      optional: false,
    },
  };

  return (
    <div {...fieldProps}>
      <FieldErrorCaptureContext>
        <Aria.Switch {...rest} className={rootClassName} inputRef={objectRef}>
          {({ isSelected }) => (
            <PropsContextProvider props={propsContext}>
              <div className={styles.track}>
                <div className={styles.handle}>
                  {isSelected ? <IconCheck size="s" /> : <IconClose size="s" />}
                </div>
              </div>
              <div className={labelStyles.label}>{children}</div>
            </PropsContextProvider>
          )}
        </Aria.Switch>
      </FieldErrorCaptureContext>
      <FieldErrorView />
    </div>
  );
});

export default Switch;
