import type { FC } from "react";
import React, { useRef } from "react";
import * as Aria from "react-aria-components";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import clsx from "clsx";
import type { PropsWithClassName } from "@/lib/types/props";
import styles from "./Autocomplete.module.scss";
import type { OverlayController } from "@/lib/controller";
import { useOverlayController } from "@/lib/controller";
import { TunnelProvider } from "@mittwald/react-tunnel";

export interface AutocompleteProps
  extends Omit<Aria.AutocompleteProps, "filter">,
    PropsWithClassName {
  controller?: OverlayController;
}

export const Autocomplete: FC<AutocompleteProps> = (props) => {
  const {
    children,
    className,
    controller: controllerFromProps,
    ...rest
  } = props;

  const controllerFromContext = useOverlayController("ContextMenu");

  const controller = controllerFromProps ?? controllerFromContext;

  const rootClassName = clsx(styles.autocomplete, className);

  const { contains } = Aria.useFilter({ sensitivity: "base" });
  const filter = (textValue: string, inputValue: string) => {
    return contains(textValue, inputValue);
  };

  const triggerRef = useRef<HTMLDivElement>(null);

  const propsContext: PropsContext = {
    ContextMenu: {
      triggerRef,
      closeOverlay: false,
      className: styles.contextMenu,
      placement: "bottom start",
      controller,
      MenuItem: {
        className: styles.menuItem,
      },
    },

    TextField: {
      onFocus: () => controller.open(),
      onInput: () => controller.open(),
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <TunnelProvider>
        <div className={rootClassName} ref={triggerRef}>
          <Aria.UNSTABLE_Autocomplete {...rest} filter={filter}>
            {children}
          </Aria.UNSTABLE_Autocomplete>
        </div>
      </TunnelProvider>
    </PropsContextProvider>
  );
};

export default Autocomplete;
