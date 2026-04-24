import type { ColumnLayoutProps } from "@/components/ColumnLayout";
import { ColumnLayout } from "@/components/ColumnLayout";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./CheckboxGroup.module.scss";
import { useObjectRef } from "@react-aria/utils";
import { useMakeFocusable } from "@/lib/hooks/dom/useMakeFocusable";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { UiComponentTunnelExit } from "../UiComponentTunnel/UiComponentTunnelExit";

export interface CheckboxGroupProps
  extends
    PropsWithChildren<Omit<Aria.CheckboxGroupProps, "children">>,
    Pick<ColumnLayoutProps, "s" | "m" | "l">,
    FlowComponentProps {}

/** @flr-generate all */
export const CheckboxGroup = flowComponent("CheckboxGroup", (props) => {
  const { children, className, isInvalid, s, m, l, ref, ...rest } = props;

  const {
    FieldErrorView,
    fieldPropsContext,
    fieldProps,
    FieldErrorCaptureContext,
  } = useFieldComponent(props, "CheckboxGroup");

  const propsContext: PropsContext = {
    Checkbox: {
      isInvalid,
      className: styles.checkbox,
      tunnel: {
        id: "checkboxes",
        component: "CheckboxGroup",
      },
    },
    CheckboxButton: {
      isInvalid,
      className: styles.checkboxButton,
      tunnel: {
        id: "checkboxButtons",
        component: "CheckboxGroup",
      },
    },
    ...fieldPropsContext,
  };

  const objectRef = useObjectRef(ref);
  useMakeFocusable(objectRef);

  return (
    <Aria.CheckboxGroup
      {...rest}
      {...fieldProps}
      isInvalid={isInvalid}
      className={clsx(fieldProps.className, className)}
      ref={objectRef}
    >
      <FieldErrorCaptureContext>
        <PropsContextProvider props={propsContext}>
          {children}

          <ColumnLayout s={s} m={m} l={l} className={styles.checkboxGroup}>
            <UiComponentTunnelExit
              id="checkboxButtons"
              component="CheckboxGroup"
            />
          </ColumnLayout>

          <ColumnLayout
            s={s ?? [1]}
            m={m ?? [1]}
            l={l ?? [1]}
            rowGap="s"
            className={styles.checkboxGroup}
          >
            <UiComponentTunnelExit id="checkboxes" component="CheckboxGroup" />
          </ColumnLayout>
        </PropsContextProvider>
      </FieldErrorCaptureContext>
      <FieldErrorView />
    </Aria.CheckboxGroup>
  );
});

export default CheckboxGroup;
