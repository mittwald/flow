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
import { useObjectRef } from "@react-aria/utils";
import { useMakeFocusable } from "@/lib/hooks/dom/useMakeFocusable";

export interface CheckboxGroupProps
  extends PropsWithChildren<Omit<Aria.CheckboxGroupProps, "children">>,
    Pick<ColumnLayoutProps, "s" | "m" | "l">,
    FlowComponentProps {}

/** @flr-generate all */
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

  const localCheckboxGroupRef = useObjectRef(ref);
  useMakeFocusable(localCheckboxGroupRef);

  return (
    <Aria.CheckboxGroup
      {...rest}
      className={rootClassName}
      ref={localCheckboxGroupRef}
    >
      <PropsContextProvider props={propsContext} clear>
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
