import type { PropsWithChildren } from "react";
import styles from "./RadioGroup.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { ColumnLayoutProps } from "@/components/ColumnLayout";
import { ColumnLayout } from "@/components/ColumnLayout";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import formFieldStyles from "../FormField/FormField.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useObjectRef } from "@react-aria/utils";
import { useMakeFocusable } from "@/lib/hooks/dom/useMakeFocusable";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";

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
  } = useFieldComponent(props);

  const rootClassName = clsx(formFieldStyles.formField, className);
  const propsContext: PropsContext = {
    RadioButton: {
      tunnelId: "radioButtons",
    },
    Radio: {
      tunnelId: "radios",
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
      <TunnelProvider>
        <FieldErrorCaptureContext>
          <PropsContextProvider props={propsContext}>
            <ColumnLayout s={s} m={m} l={l} className={styles.radioGroup}>
              <TunnelExit id="radioButtons" />
            </ColumnLayout>

            <ColumnLayout
              s={s ?? [1]}
              m={m ?? [1]}
              l={l ?? [1]}
              rowGap="s"
              className={styles.radioGroup}
            >
              <TunnelExit id="radios" />
            </ColumnLayout>

            {children}
          </PropsContextProvider>
        </FieldErrorCaptureContext>
        <FieldErrorView />
      </TunnelProvider>
    </Aria.RadioGroup>
  );
});

export default RadioGroup;
