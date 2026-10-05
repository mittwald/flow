import { getOptionsTunnelProps } from "@/components/Option/optionsTunnel";
import { useRef, type PropsWithChildren } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import {
  dynamic,
  type PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";
import * as Aria from "react-aria-components";
import { useOverlayController } from "@/lib/controller";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import type { SearchFieldProps } from "@/components/SearchField";
import type { TextFieldProps } from "@/components/TextField";
import Options from "@/components/Options";
import locales from "./locales/*.locale.json";
import Text from "@/components/Text";
import styles from "./Autocomplete.module.scss";
import {
  UNSAFE_PortalProvider,
  useFocusWithin,
  useLocalizedStringFormatter,
  useObjectRef,
} from "react-aria";
import { joinIds, useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { isFocused } from "@/lib/form/isFocused";
import { emitElementValueChange } from "@/lib/react/emitElementValueChange";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";
import clsx from "clsx";

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
  const { children, className, ref, ...rest } = props;

  const inputRef = useObjectRef(ref);

  const { contains } = Aria.useFilter({ sensitivity: "base" });
  const stringFormatter = useLocalizedStringFormatter(locales);
  const container = useRef(null);

  const optionsOverlayController = useOverlayController("Popover", {
    reuseControllerFromContext: false,
  });

  const focusWithin = useFocusWithin({
    onBlurWithin: () => optionsOverlayController.close(),
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

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldPropsContext,
    wrapperProps,
    controlProps,
    skeletonProps,
  } = useFieldComponent(props, "Autocomplete");

  const inputProps: SearchFieldProps & TextFieldProps = {
    onKeyDown: (e) => {
      if (e.key === "Enter" && optionsOverlayController.isOpen) {
        e.preventDefault();
      }
    },
    ref: inputRef,
    onChange: handleInputChange,
  };

  const errorDescribedBy = controlProps["aria-describedby"];

  const rootClassName = clsx(
    styles.autocomplete,
    wrapperProps.className,
    className,
  );

  const propsContext: PropsContext = {
    // Merged, not replaced: a field's own `aria-describedby` must not unlink
    // the Autocomplete's error.
    SearchField: {
      ...inputProps,
      "aria-describedby": dynamic((p) =>
        joinIds(errorDescribedBy, p["aria-describedby"]),
      ),
    },
    TextField: {
      ...inputProps,
      "aria-describedby": dynamic((p) =>
        joinIds(errorDescribedBy, p["aria-describedby"]),
      ),
    },
    Option: {
      tunnel: getOptionsTunnelProps("Autocomplete"),
    },
    Popover: {
      className: styles.popover,
    },
    ...fieldPropsContext,
  };

  return (
    <div {...skeletonProps} className={rootClassName}>
      <FieldErrorCaptureContext>
        <PropsContextProvider
          props={propsContext}
          dependencies={[optionsOverlayController, errorDescribedBy]}
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
                  triggerRef={container}
                  controller={optionsOverlayController}
                  renderEmptyState={renderEmptyState}
                  isNonModal
                  placement="bottom start"
                >
                  <UiComponentTunnelExit
                    id="options"
                    component="Autocomplete"
                  />
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
