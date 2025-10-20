import type { PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import formFieldStyles from "../FormField/FormField.module.scss";
import styles from "./SearchField.module.scss";
import clsx from "clsx";
import { PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { Button } from "@/components/Button";
import { IconClose, IconSearch } from "@/components/Icon/components/icons";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { ReactAriaControlledValueFix } from "@/lib/react/ReactAriaControlledValueFix";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";

export interface SearchFieldProps
  extends PropsWithChildren<Omit<Aria.SearchFieldProps, "children">>,
    FlowComponentProps<HTMLInputElement> {}

/** @flr-generate all */
export const SearchField = flowComponent("SearchField", (props) => {
  const { children, className, ref, ...rest } = props;

  const {
    FieldErrorView,
    FieldErrorResetContext,
    fieldProps,
    fieldPropsContext,
  } = useFieldComponent(props);

  const rootClassName = clsx(
    formFieldStyles.formField,
    styles.searchField,
    className,
  );

  const stringFormatter = useLocalizedStringFormatter(locales);
  const searchText = stringFormatter.format(`searchField.search`);

  return (
    <Aria.SearchField
      {...rest}
      {...fieldProps}
      aria-label={searchText}
      className={clsx(rootClassName, fieldProps.className)}
    >
      <PropsContextProvider props={fieldPropsContext}>
        <FieldErrorResetContext>{children}</FieldErrorResetContext>
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
      <FieldErrorView />
    </Aria.SearchField>
  );
});

export default SearchField;
