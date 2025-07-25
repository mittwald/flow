import { useRef, type PropsWithChildren } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import * as Aria from "react-aria-components";
import { useOverlayController } from "@/lib/controller";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import {
  UNSAFE_PortalProvider,
  useFocusWithin,
  useLocalizedStringFormatter,
} from "react-aria";
import styles from "./Autocomplete.module.scss";
import locales from "./locales/*.locale.json";
import { Text } from "@/components/Text";
import type { SearchFieldProps } from "@/components/SearchField";
import type { TextFieldProps } from "@/components/TextField";

export interface AutocompleteProps
  extends PropsWithChildren,
    PropsWithClassName,
    FlowComponentProps,
    Omit<Aria.AutocompleteProps, "children" | "onInputChange" | "inputValue"> {}

/** @flr-generate all */
export const Autocomplete = flowComponent("Autocomplete", (props) => {
  const { children, ...rest } = props;
  const stringFormatter = useLocalizedStringFormatter(locales);

  const { contains } = Aria.useFilter({ sensitivity: "base" });

  const triggerRef = useRef<HTMLInputElement>(null);
  const container = useRef(null);

  const controller = useOverlayController("ContextMenu", {
    reuseControllerFromContext: false,
  });
  const focusWithin = useFocusWithin({
    onBlurWithin: controller.close,
  });
  const menuIsOpen = controller.useIsOpen();

  const inputProps: SearchFieldProps & TextFieldProps = {
    onKeyDown: (e) => {
      if (e.key === "Enter" && menuIsOpen) {
        e.preventDefault();
      }
    },
    ref: triggerRef,
  };

  const propsContext: PropsContext = {
    ContextMenu: {
      placement: "bottom start",
      controller,
      isNonModal: true,
      renderEmptyState: () => (
        <Text className={styles.empty}>
          {stringFormatter.format("autocomplete.empty")}
        </Text>
      ),
      onAction: (key) => {
        const input = triggerRef.current;
        if (input) {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            Object.getPrototypeOf(input),
            "value",
          )?.set;
          nativeInputValueSetter?.call(input, String(key));
          const event = new Event("change", { bubbles: true });
          input.dispatchEvent(event);
        }
      },
      triggerRef,
    },
    SearchField: inputProps,
    TextField: inputProps,
  };

  const handleOnInputChange = (value: string) => {
    if (!value) {
      controller.close();
    } else if (!menuIsOpen) {
      controller.open();
    }
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
            {...rest}
          >
            {children}
          </Aria.Autocomplete>
        </UNSAFE_PortalProvider>
      </div>
    </PropsContextProvider>
  );
});

export default Autocomplete;
