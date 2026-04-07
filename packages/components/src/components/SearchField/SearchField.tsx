import type { PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import formFieldStyles from "../FormField/FormField.module.scss";
import styles from "./SearchField.module.scss";
import clsx from "clsx";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { Button } from "@/components/Button";
import { IconClose, IconSearch } from "@/components/Icon/components/icons";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { useControlledHostValueProps } from "@/lib/remote/useControlledHostValueProps";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";

export interface SearchFieldProps
  extends
    PropsWithChildren<Omit<Aria.SearchFieldProps, "children">>,
    FlowComponentProps<HTMLInputElement> {}

/** @flr-generate all */
export const SearchField = flowComponent("SearchField", (props) => {
  const { children, className, ref, ...rest } =
    useControlledHostValueProps(props);

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
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

  const propsContext: PropsContext = {
    Kbd: {
      isDisabled: props.isDisabled,
      tunnelId: "kbd",
      className: styles.kbd,
    },
    ...fieldPropsContext,
  };

  return (
    <Aria.SearchField
      {...rest}
      {...fieldProps}
      aria-label={searchText}
      className={clsx(rootClassName, fieldProps.className)}
    >
      <TunnelProvider>
        <PropsContextProvider props={propsContext}>
          <FieldErrorCaptureContext>{children}</FieldErrorCaptureContext>

          <div className={styles.inputContainer}>
            <IconSearch className={styles.searchIcon} />
            <Aria.Input
              placeholder={searchText}
              className={styles.input}
              ref={ref}
            />
            <TunnelExit id="kbd" />
            <Button
              className={styles.clearButton}
              variant="plain"
              color="secondary"
            >
              <IconClose />
            </Button>
          </div>
        </PropsContextProvider>
        <FieldErrorView />
      </TunnelProvider>
    </Aria.SearchField>
  );
});

export default SearchField;
