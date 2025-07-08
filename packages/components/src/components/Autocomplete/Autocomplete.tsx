import { useRef, type PropsWithChildren } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import * as Aria from "react-aria-components";
import { useOverlayController } from "@/lib/controller";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { useLocalizedStringFormatter } from "react-aria";
import styles from "./Autocomplete.module.scss";
import locales from "./locales/*.locale.json";
import { Text } from "@/components/Text";
import type { SearchFieldProps } from "@/components/SearchField";
import type { TextFieldProps } from "@/components/TextField";

export interface AutocompleteProps
  extends PropsWithChildren,
    PropsWithClassName,
    FlowComponentProps,
    Omit<Aria.AutocompleteProps, "children" | "onInputChange" | "inputValue"> {
  onChange?: Aria.AutocompleteProps["onInputChange"];
  value?: Aria.AutocompleteProps["inputValue"];
}

/** @flr-generate all */
export const Autocomplete = flowComponent("Autocomplete", (props) => {
  const { children, onChange, value, ...rest } = props;
  const stringFormatter = useLocalizedStringFormatter(locales);

  const { contains } = Aria.useFilter({ sensitivity: "base" });

  const triggerRef = useRef<HTMLInputElement>(null);

  const controller = useOverlayController("ContextMenu", {
    reuseControllerFromContext: false,
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
        onChange?.(key.toString());
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

    onChange?.(value);
  };

  return (
    <PropsContextProvider
      props={propsContext}
      mergeInParentContext
      dependencies={[menuIsOpen, controller]}
    >
      <Aria.Autocomplete
        onInputChange={handleOnInputChange}
        filter={contains}
        inputValue={value}
        {...rest}
      >
        {children}
      </Aria.Autocomplete>
    </PropsContextProvider>
  );
});

export default Autocomplete;
