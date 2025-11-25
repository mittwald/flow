import { type PropsWithChildren, type RefObject, useRef } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import * as Aria from "react-aria-components";
import { useOverlayController } from "@/lib/controller";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import type { SearchFieldProps } from "@/components/SearchField";
import type { TextFieldProps } from "@/components/TextField";
import Options from "@/components/Options";
import { TunnelExit } from "@mittwald/react-tunnel";
import locales from "./locales/*.locale.json";
import Text from "@/components/Text";
import styles from "./Autocomplete.module.scss";
import {
  UNSAFE_PortalProvider,
  useFocusWithin,
  useLocalizedStringFormatter,
} from "react-aria";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { useManagedValue } from "@/lib/hooks/useManagedValue";
import { useObjectRef } from "@react-aria/utils";

export interface AutocompleteProps
  extends PropsWithChildren,
    PropsWithClassName,
    FlowComponentProps,
    Pick<Aria.AutocompleteProps, "filter" | "disableVirtualFocus">,
    Omit<TextFieldProps | SearchFieldProps, "ref" | "className"> {
  value?: string;
  defaultValue?: string;
  inputRef?: RefObject<HTMLInputElement>;
}

/** @flr-generate all */
export const Autocomplete = flowComponent("Autocomplete", (props) => {
  const {
    value,
    handleOnChange,
    ref,
    inputRef,
    children,
    filter,
    disableVirtualFocus,
    ...rest
  } = useManagedValue(props);

  const { contains } = Aria.useFilter({ sensitivity: "base" });
  const stringFormatter = useLocalizedStringFormatter(locales);
  const container = useRef(null);

  const localInputRef = useObjectRef(inputRef);

  const controller = useOverlayController("Popover", {
    reuseControllerFromContext: false,
  });

  const focusWithin = useFocusWithin({
    onBlurWithin: controller.close,
  });

  const inputProps: SearchFieldProps & TextFieldProps = {
    ...rest,
    onKeyDown: (e) => {
      if (e.key === "Enter" && controller.isOpen) {
        e.preventDefault();
      }
    },
    ref: localInputRef,
  };

  const renderEmptyState = () => (
    <Text className={styles.empty}>
      {stringFormatter.format("autocomplete.empty")}
    </Text>
  );

  const handleOnInputChange = (value: string) => {
    if (!value) {
      controller.close();
    } else if (!controller.isOpen) {
      controller.open();
    }

    handleOnChange?.(value);
  };

  const handleOptionAction = (key: Aria.Key) => {
    handleOnChange(String(key));
    controller.close();
  };

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldPropsContext,
    fieldProps,
  } = useFieldComponent(props);

  const propsContext: PropsContext = {
    SearchField: inputProps,
    TextField: { ...inputProps, inputContext: Aria.AutocompleteContext },
    Option: {
      tunnelId: "options",
    },
    Popover: {
      className: styles.popover,
    },
    ...fieldPropsContext,
  };

  return (
    <div {...fieldProps} ref={ref}>
      <FieldErrorCaptureContext>
        <PropsContextProvider props={propsContext} clear>
          <div {...focusWithin.focusWithinProps} ref={container}>
            <UNSAFE_PortalProvider getContainer={() => container.current}>
              <Aria.Autocomplete
                onInputChange={handleOnInputChange}
                filter={filter ?? contains}
                disableAutoFocusFirst
                disableVirtualFocus={disableVirtualFocus}
                inputValue={value}
              >
                {children}
                <Options
                  onAction={handleOptionAction}
                  triggerRef={localInputRef}
                  controller={controller}
                  renderEmptyState={renderEmptyState}
                  isNonModal
                  placement="bottom start"
                >
                  <TunnelExit id="options" />
                </Options>
              </Aria.Autocomplete>
            </UNSAFE_PortalProvider>
          </div>
        </PropsContextProvider>
      </FieldErrorCaptureContext>
      <FieldErrorView />
    </div>
  );
});

export default Autocomplete;
