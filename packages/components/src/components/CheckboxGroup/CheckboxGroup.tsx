import type { ColumnLayoutProps } from "@/components/ColumnLayout";
import { ColumnLayout } from "@/components/ColumnLayout";
import { FieldError } from "@/components/FieldError";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import formFieldStyles from "../FormField/FormField.module.scss";
import styles from "./CheckboxGroup.module.scss";

export interface CheckboxGroupProps
  extends PropsWithChildren<Omit<Aria.CheckboxGroupProps, "children">>,
    Pick<ColumnLayoutProps, "s" | "m" | "l">,
    FlowComponentProps {}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const CheckboxGroup = flowComponent("CheckboxGroup", (props) => {
  const { children, className, s, m, l, ref, ...rest } = props;

  const rootClassName = clsx(formFieldStyles.formField, className);

  const propsContext: PropsContext = {
    Label: {
      className: formFieldStyles.label,
    },
    FieldDescription: {
      className: formFieldStyles.fieldDescription,
      tunnelId: "fieldDescription",
    },
    FieldError: {
      className: formFieldStyles.customFieldError,
      tunnelId: "fieldError",
    },
    Checkbox: {
      tunnelId: "checkboxes",
      className: styles.checkbox,
    },
    CheckboxButton: {
      tunnelId: "checkboxButtons",
      className: styles.checkboxButton,
    },
  };

  return (
    <Aria.CheckboxGroup {...rest} className={rootClassName} ref={ref}>
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          {children}

          <ColumnLayout s={s} m={m} l={l} className={styles.checkboxGroup}>
            <TunnelExit id="checkboxButtons" />
          </ColumnLayout>

          <ColumnLayout
            s={s ?? [1]}
            m={m ?? [1]}
            l={l ?? [1]}
            rowGap="s"
            className={styles.checkboxGroup}
          >
            <TunnelExit id="checkboxes" />
          </ColumnLayout>

          <TunnelExit id="fieldDescription" />
          <TunnelExit id="fieldError" />
        </TunnelProvider>
      </PropsContextProvider>
      <FieldError className={formFieldStyles.fieldError} />
    </Aria.CheckboxGroup>
  );
});

export default CheckboxGroup;
