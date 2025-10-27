import type { PropsWithChildren } from "react";
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
import { type OverlayController, useOverlayController } from "@/lib/controller";
import type { OptionsProps } from "@/components/Options/Options";
import { useObjectRef } from "@react-aria/utils";
import { useMakeFocusable } from "@/lib/hooks/dom/useMakeFocusable";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";

export interface ComboBoxProps
  extends Omit<Aria.ComboBoxProps<never>, "children">,
    Pick<Aria.InputProps, "placeholder">,
    Pick<OptionsProps, "renderEmptyState">,
    PropsWithChildren,
    FlowComponentProps {
  onChange?: (value: string) => void;
  controller?: OverlayController;
}

/** @flr-generate all */
export const ComboBox = flowComponent("ComboBox", (props) => {
  const {
    children,
    className,
    menuTrigger = "focus",
    onChange = () => {
      // default: do nothing
    },
    onSelectionChange = () => {
      // default: do nothing
    },
    controller: controllerFromProps,
    placeholder,
    ref,
    renderEmptyState,

    ...rest
  } = props;

  const {
    FieldErrorView,
    FieldErrorResetContext,
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

  const handleOnSelectionChange = (key: Key | null) => {
    if (key === null) {
      return;
    }
    onChange(String(key));
    onSelectionChange(key);
  };

  const controllerFromContext = useOverlayController("ComboBox", {
    reuseControllerFromContext: true,
  });

  const controller = controllerFromProps ?? controllerFromContext;

  const localComboBoxRef = useObjectRef(ref);
  useMakeFocusable(localComboBoxRef);

  return (
    <Aria.ComboBox
      {...fieldProps}
      menuTrigger={menuTrigger}
      className={rootClassName}
      {...rest}
      ref={localComboBoxRef}
      onSelectionChange={handleOnSelectionChange}
      onOpenChange={(isOpen) => controller.setOpen(isOpen)}
    >
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          <FieldErrorResetContext>
            <div className={styles.input}>
              <Aria.Input placeholder={placeholder} />
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
              renderEmptyState={renderEmptyState}
            >
              <TunnelExit id="options" />
            </Options>
          </FieldErrorResetContext>
          <FieldErrorView />
        </TunnelProvider>
      </PropsContextProvider>
    </Aria.ComboBox>
  );
});

export default ComboBox;
