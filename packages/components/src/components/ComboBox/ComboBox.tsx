import { type PropsWithChildren } from "react";
import type { Key } from "react-aria-components";
import * as Aria from "react-aria-components";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import { Button } from "@/components/Button";
import { IconChevronDown } from "@/components/Icon/components/icons";
import { Options } from "@/components/Options";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import clsx from "clsx";
import styles from "./ComboBox.module.scss";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useOverlayController } from "@/lib/controller";
import type { OptionsProps } from "@/components/Options/Options";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";

export interface ComboBoxProps
  extends
    Omit<Aria.ComboBoxProps<never>, "children">,
    Pick<Aria.InputProps, "placeholder">,
    Pick<OptionsProps, "renderEmptyState">,
    PropsWithChildren,
    FlowComponentProps<HTMLInputElement> {
  onChange?: (value: string) => void;
}

/** @flr-generate all */
export const ComboBox = flowComponent("ComboBox", (props) => {
  const {
    children,
    className,
    menuTrigger = "focus",
    onChange,
    onSelectionChange,
    placeholder,
    ref,
    renderEmptyState,
    ...rest
  } = props;

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldProps,
    fieldPropsContext,
  } = useFieldComponent(props);

  const stringFormatter = useLocalizedStringFormatter(locales);

  const rootClassName = clsx(fieldProps.className, styles.comboBox, className);

  const propsContext: PropsContext = {
    Option: {
      tunnelId: "options",
    },
    ...fieldPropsContext,
  };

  const handleSelectionChange = (key: Key | null) => {
    if (key === null) {
      return;
    }
    onChange?.(String(key));
    onSelectionChange?.(key);
  };

  const controller = useOverlayController("ComboBox", {
    reuseControllerFromContext: false,
  });

  return (
    <Aria.ComboBox
      {...fieldProps}
      menuTrigger={menuTrigger}
      className={rootClassName}
      {...rest}
      onSelectionChange={handleSelectionChange}
      onOpenChange={(isOpen) => {
        controller.setOpen(isOpen);
      }}
    >
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          <FieldErrorCaptureContext>
            <div className={styles.input}>
              <Aria.Input placeholder={placeholder} ref={ref} />
              <Button
                className={styles.toggle}
                aria-label={stringFormatter.format("comboBox.showOptions")}
                variant="plain"
                color="secondary"
              >
                <IconChevronDown />
              </Button>
            </div>

            {children}

            <Options
              controller={controller}
              onOpenChange={() => {
                // cut-off to avoid double controller state changes
              }}
              renderEmptyState={renderEmptyState}
            >
              <TunnelExit id="options" />
            </Options>
          </FieldErrorCaptureContext>
          <FieldErrorView />
        </TunnelProvider>
      </PropsContextProvider>
    </Aria.ComboBox>
  );
});

export default ComboBox;
