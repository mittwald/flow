import { useRef, type PropsWithChildren } from "react";
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
  useObjectRef,
} from "react-aria";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { isFocused } from "@/lib/form/isFocused";
import { emitElementValueChange } from "@/lib/react/emitElementValueChange";

export interface AutocompleteProps
  extends
    PropsWithChildren,
    PropsWithClassName,
    FlowComponentProps<HTMLInputElement>,
    Omit<
      Aria.AutocompleteProps,
      "children" | "onInputChange" | "inputValue" | "defaultInputValue" | "ref"
    > {}

/** @flr-generate all */
export const Autocomplete = flowComponent("Autocomplete", (props) => {
  const { children, ref, ...rest } = props;

  const inputRef = useObjectRef(ref);

  const { contains } = Aria.useFilter({ sensitivity: "base" });
  const stringFormatter = useLocalizedStringFormatter(locales);
  const container = useRef(null);

  const optionsOverlayController = useOverlayController("Popover", {
    reuseControllerFromContext: false,
  });

  const focusWithin = useFocusWithin({
    onBlurWithin: optionsOverlayController.close,
  });

  const renderEmptyState = () => (
    <Text className={styles.empty}>
      {stringFormatter.format("autocomplete.empty")}
    </Text>
  );

  const handleInputChange = (value: string) => {
    if (value === "") {
      optionsOverlayController.close();
    } else if (isFocused(inputRef.current)) {
      optionsOverlayController.open();
    }
  };

  const handleOptionAction = (key: Aria.Key) => {
    const value = String(key);
    if (inputRef.current) {
      emitElementValueChange(inputRef.current, value);
    }
    optionsOverlayController.close();
  };

  const inputProps: SearchFieldProps & TextFieldProps = {
    onKeyDown: (e) => {
      if (e.key === "Enter" && optionsOverlayController.isOpen) {
        e.preventDefault();
      }
    },
    ref: inputRef,
    onChange: handleInputChange,
  };

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldPropsContext,
    fieldProps,
  } = useFieldComponent(props);

  const propsContext: PropsContext = {
    SearchField: inputProps,
    TextField: inputProps,
    Option: {
      tunnelId: "options",
    },
    Popover: {
      className: styles.popover,
    },
    ...fieldPropsContext,
  };

  return (
    <div {...fieldProps}>
      <FieldErrorCaptureContext>
        <PropsContextProvider
          props={propsContext}
          dependencies={[optionsOverlayController]}
        >
          <div {...focusWithin.focusWithinProps} ref={container}>
            <UNSAFE_PortalProvider getContainer={() => container.current}>
              <Aria.Autocomplete
                filter={contains}
                disableAutoFocusFirst
                {...rest}
              >
                {children}
                <Options
                  onAction={handleOptionAction}
                  triggerRef={inputRef}
                  controller={optionsOverlayController}
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
