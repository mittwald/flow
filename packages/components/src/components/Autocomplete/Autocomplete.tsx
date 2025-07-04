import React, {
  type KeyboardEventHandler,
  type PropsWithChildren,
  useRef,
} from "react";
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
import clsx from "clsx";
import locales from "./locales/*.locale.json";
import { Text } from "@/components/Text";

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

  const controller = useOverlayController("Popover", {
    reuseControllerFromContext: true,
  });
  const controllerIsOpen = controller.useIsOpen();

  const triggerRef = useRef<HTMLDivElement>(null);
  const portalContainerRef = useRef<HTMLDivElement>(null);

  const { focusWithinProps } = useFocusWithin({
    onBlurWithin: () => controller.close(),
  });

  const propsContext: PropsContext = {
    ContextMenu: {
      controller,
      triggerRef,
      shouldUpdatePosition: false,
      shouldCloseOnInteractOutside: () => false,
      isNonModal: true,
      renderEmptyState: () => (
        <Text className={styles.empty}>
          {stringFormatter.format("autocomplete.empty")}
        </Text>
      ),
      onAction: (key) => {
        onChange?.(key.toString());
      },
    },
  };

  const handleOnInputChange = (value: string) => {
    if (!value) {
      controller.close();
    } else if (!controllerIsOpen) {
      controller.open();
    }

    onChange?.(value);
  };

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (event.key === "Enter" && controllerIsOpen) {
      event.preventDefault();
    }
  };

  return (
    <UNSAFE_PortalProvider getContainer={() => portalContainerRef.current}>
      <PropsContextProvider props={propsContext}>
        <div
          {...focusWithinProps}
          className={clsx(styles.autocomplete)}
          onKeyDownCapture={handleKeyDown}
        >
          <Aria.Autocomplete
            onInputChange={handleOnInputChange}
            filter={contains}
            inputValue={value}
            {...rest}
          >
            {children}
          </Aria.Autocomplete>
          <div
            ref={portalContainerRef}
            className={clsx(styles.portalContainer)}
          />
        </div>
      </PropsContextProvider>
    </UNSAFE_PortalProvider>
  );
});

export default Autocomplete;
