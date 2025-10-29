import { type PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./Switch.module.scss";
import clsx from "clsx";
import { IconCheck, IconClose } from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { useObjectRef } from "@react-aria/utils";
import labelStyles from "../Label/Label.module.scss";
import { useMakeFocusable } from "@/lib/hooks/dom/useMakeFocusable";

export interface SwitchProps
  extends PropsWithChildren<Omit<Aria.SwitchProps, "children">>,
    FlowComponentProps<HTMLLabelElement> {
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
    inputRef,
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.switch,
    className,
    styles[`label-${labelPosition}`],
  );

  const localSwitchRef = useObjectRef(ref);
  const localInputRef = useObjectRef(inputRef);

  useMakeFocusable(localSwitchRef, () => {
    localInputRef.current?.focus();
  });

  const { FieldErrorView, fieldPropsContext, fieldProps } =
    useFieldComponent(props);

  const propsContext: PropsContext = {
    ...fieldPropsContext,
    Label: {
      ...fieldPropsContext.Label,
      optional: false,
    },
  };

  return (
    <div {...fieldProps}>
      <Aria.Switch
        {...rest}
        className={rootClassName}
        ref={localSwitchRef}
        inputRef={localInputRef}
      >
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
      <FieldErrorView />
    </div>
  );
});

export default Switch;
