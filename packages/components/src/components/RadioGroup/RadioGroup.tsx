import type { PropsWithChildren } from "react";
import styles from "./RadioGroup.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { ColumnLayoutProps } from "@/components/ColumnLayout";
import { ColumnLayout } from "@/components/ColumnLayout";
import formFieldStyles from "../FormField/FormField.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useObjectRef } from "@react-aria/utils";
import { useMakeFocusable } from "@/lib/hooks/dom/useMakeFocusable";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { UiComponentTunnelExit } from "../UiComponentTunnel/UiComponentTunnelExit";

export interface RadioGroupProps
  extends
    PropsWithChildren<Omit<Aria.RadioGroupProps, "children">>,
    FlowComponentProps,
    Pick<ColumnLayoutProps, "s" | "m" | "l"> {}

/** @flr-generate all */
export const RadioGroup = flowComponent("RadioGroup", (props) => {
  const { children, className, s, m, l, ref, ...rest } = props;

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldProps,
    fieldPropsContext,
  } = useFieldComponent(props, "RadioGroup");

  const rootClassName = clsx(formFieldStyles.formField, className);
  const propsContext: PropsContext = {
    RadioButton: {
      tunnel: {
        id: "radioButtons",
        component: "RadioGroup",
      },
    },
    Radio: {
      tunnel: {
        id: "radios",
        component: "RadioGroup",
      },
    },
    ...fieldPropsContext,
  };

  const localRadioRef = useObjectRef(ref);
  useMakeFocusable(localRadioRef);

  return (
    <Aria.RadioGroup
      {...rest}
      className={clsx(rootClassName, fieldProps.className)}
      ref={localRadioRef}
    >
      <FieldErrorCaptureContext>
        <PropsContextProvider props={propsContext}>
          <ColumnLayout s={s} m={m} l={l} className={styles.radioGroup}>
            <UiComponentTunnelExit id="radioButtons" component="RadioGroup" />
          </ColumnLayout>

          <ColumnLayout
            s={s ?? [1]}
            m={m ?? [1]}
            l={l ?? [1]}
            rowGap="s"
            className={styles.radioGroup}
          >
            <UiComponentTunnelExit id="radios" component="RadioGroup" />
          </ColumnLayout>

          {children}
        </PropsContextProvider>
      </FieldErrorCaptureContext>
      <FieldErrorView />
    </Aria.RadioGroup>
  );
});

export default RadioGroup;
