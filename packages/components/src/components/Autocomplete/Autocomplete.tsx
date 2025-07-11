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
} from "react-aria";
export interface AutocompleteProps
  extends PropsWithChildren,
    PropsWithClassName,
    FlowComponentProps,
    Omit<Aria.AutocompleteProps, "children" | "onInputChange" | "inputValue"> {}

/** @flr-generate all */
export const Autocomplete = flowComponent("Autocomplete", (props) => {
  const { children, ...rest } = props;

  const { contains } = Aria.useFilter({ sensitivity: "base" });
  const stringFormatter = useLocalizedStringFormatter(locales);
  const container = useRef(null);
  const triggerRef = useRef<HTMLInputElement>(null);

  const controller = useOverlayController("Popover", {
    reuseControllerFromContext: false,
  });
  const menuIsOpen = controller.useIsOpen();

  const focusWithin = useFocusWithin({
    onBlurWithin: controller.close,
  });

  const inputProps: SearchFieldProps & TextFieldProps = {
    onKeyDown: (e) => {
      if (e.key === "Enter" && menuIsOpen) {
        e.preventDefault();
      }
    },
    ref: triggerRef,
  };

  const renderEmptyState = () => (
    <Text className={styles.empty}>
      {stringFormatter.format("autocomplete.empty")}
    </Text>
  );

  const propsContext: PropsContext = {
    SearchField: inputProps,
    TextField: inputProps,
    Option: {
      tunnelId: "options",
    },
    Popover: {
      className: styles.popover,
    },
  };

  const handleOnInputChange = (value: string) => {
    if (!value) {
      controller.close();
    } else if (!menuIsOpen) {
      controller.open();
    }
  };

  const handleOptionAction = (key: Aria.Key) => {
    const inputElement = triggerRef.current;
    if (inputElement) {
      // Set value on input element and trigger change event
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;
      nativeInputValueSetter?.call(inputElement, String(key));
      const event = new Event("change", { bubbles: true });
      inputElement.dispatchEvent(event);
    }
    controller.close();
  };

  return (
    <PropsContextProvider
      props={propsContext}
      mergeInParentContext
      dependencies={[menuIsOpen, controller]}
    >
      <div {...focusWithin.focusWithinProps} ref={container}>
        <UNSAFE_PortalProvider getContainer={() => container.current}>
          <Aria.Autocomplete
            onInputChange={handleOnInputChange}
            filter={contains}
            disableAutoFocusFirst
            {...rest}
          >
            {children}
            <Options
              onAction={handleOptionAction}
              triggerRef={triggerRef}
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
  );
});

export default Autocomplete;
