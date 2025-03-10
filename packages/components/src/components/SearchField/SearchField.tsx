import { Button } from "@/components/Button";
import { FieldError } from "@/components/FieldError";
import { IconClose, IconSearch } from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { useLocalizedStringFormatter } from "react-aria";
import * as Aria from "react-aria-components";
import formFieldStyles from "../FormField/FormField.module.scss";
import locales from "./locales/*.locale.json";
import styles from "./SearchField.module.scss";

export interface SearchFieldProps
  extends PropsWithChildren<Omit<Aria.SearchFieldProps, "children">>,
    FlowComponentProps {}

/** @flr-generate all */
export const SearchField = flowComponent<"SearchField", HTMLInputElement>(
  "SearchField",
  (props) => {
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
      <ClearPropsContextView>
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
            <Aria.Input
              placeholder={searchText}
              className={styles.input}
              ref={ref}
            />
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
      </ClearPropsContextView>
    );
  },
);

export default SearchField;
