import type { FC, PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import { Button } from "@/components/Button";
import { IconChevronDown } from "@/components/Icon/components/icons";
import { Options } from "@/components/Options";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import clsx from "clsx";
import styles from "./Autocomplete.module.scss";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { Key } from "react-aria-components";

export interface AutocompleteProps
  extends Omit<Aria.ComboBoxProps<never>, "children">,
    PropsWithChildren,
    FlowComponentProps {
  onChange?: (value: string) => void;
}

export const Autocomplete: FC<AutocompleteProps> = flowComponent(
  "Autocomplete",
  (props) => {
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
      refProp: ref,
      ...rest
    } = props;

    const stringFormatter = useLocalizedStringFormatter(locales);

    const rootClassName = clsx(
      styles.autocomplete,
      formFieldStyles.formField,
      className,
    );

    const propsContext: PropsContext = {
      Label: {
        className: formFieldStyles.label,
        optional: !props.isRequired,
      },
      FieldDescription: {
        className: formFieldStyles.fieldDescription,
      },
      FieldError: {
        className: formFieldStyles.customFieldError,
      },
      Option: {
        tunnelId: "options",
      },
    };

    const handleOnSelectionChange = (key: Key | null) => {
      onChange(String(key));
      onSelectionChange(key);
    };

    return (
      <Aria.ComboBox
        menuTrigger={menuTrigger}
        className={rootClassName}
        {...rest}
        ref={ref}
        onSelectionChange={handleOnSelectionChange}
      >
        <PropsContextProvider props={propsContext}>
          <TunnelProvider>
            <div className={styles.input}>
              <Aria.Input />
              <Button
                className={styles.toggle}
                aria-label={stringFormatter.format("autocomplete.showOptions")}
                variant="plain"
                color="secondary"
              >
                <IconChevronDown />
              </Button>
            </div>

            {children}

            <Options>
              <TunnelExit id="options" />
            </Options>
          </TunnelProvider>
        </PropsContextProvider>
      </Aria.ComboBox>
    );
  },
);

export default Autocomplete;
