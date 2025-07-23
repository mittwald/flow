import type { PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import formFieldStyles from "../FormField/FormField.module.scss";
import styles from "./SearchField.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import ClearPropsContext from "@/components/ClearPropsContext/ClearPropsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { FieldError } from "@/components/FieldError";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { Button } from "@/components/Button";
import { IconClose, IconSearch } from "@/components/Icon/components/icons";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { ReactAriaControlledValueFix } from "@/lib/react/ReactAriaControlledValueFix";

export interface SearchFieldProps
  extends PropsWithChildren<Omit<Aria.SearchFieldProps, "children">>,
    FlowComponentProps<HTMLInputElement> {}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const SearchField = flowComponent("SearchField", (props) => {
  const { children, className, ref, ...rest } = props;

  const rootClassName = clsx(
    formFieldStyles.formField,
    styles.searchField,
    className,
  );

  const stringFormatter = useLocalizedStringFormatter(locales);

  const searchText = stringFormatter.format(`searchField.search`);

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
  };

  return (
    <ClearPropsContext>
      <Aria.SearchField
        aria-label={searchText}
        {...rest}
        className={rootClassName}
      >
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
        <div className={styles.inputContainer}>
          <IconSearch className={styles.searchIcon} />
          <ReactAriaControlledValueFix
            inputContext={Aria.InputContext}
            props={props}
          >
            <Aria.Input
              placeholder={searchText}
              className={styles.input}
              ref={ref}
            />
          </ReactAriaControlledValueFix>
          <Button
            className={styles.clearButton}
            variant="plain"
            color="secondary"
          >
            <IconClose />
          </Button>
        </div>
        <FieldError className={formFieldStyles.fieldError} />
      </Aria.SearchField>
    </ClearPropsContext>
  );
});

export default SearchField;
