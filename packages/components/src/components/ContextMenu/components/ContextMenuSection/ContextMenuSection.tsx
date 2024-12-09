import * as Aria from "react-aria-components";
import type { PropsWithChildren } from "react";
import React from "react";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import styles from "../../ContextMenu.module.scss";
import type { ContextMenuSelectionMode } from "@/components/ContextMenu/lib";
import {
  getAriaSelectionMode,
  getCloseOverlayType,
  getMenuItemSelectionVariant,
} from "@/components/ContextMenu/lib";
import { Action } from "@/components/Action";

export type ContextMenuSectionProps = PropsWithChildren &
  FlowComponentProps & {
    selectionMode?: ContextMenuSelectionMode;
  };
export const ContextMenuSection = flowComponent(
  "ContextMenuSection",
  (props) => {
    const { children, selectionMode, ...rest } = props;

    const selectionVariant = getMenuItemSelectionVariant(selectionMode);

    console.log("section", selectionVariant);

    const propsContext: PropsContext = {
      Heading: {
        level: 5,
        wrapWith: <Aria.Header />,
      },
      MenuItem: {
        selectionVariant,
      },
    };

    return (
      <Aria.MenuSection
        {...rest}
        selectionMode={getAriaSelectionMode(selectionMode)}
        className={styles.section}
      >
        <PropsContextProvider props={propsContext} mergeInParentContext>
          <Action skip>
            <Action closeOverlay={getCloseOverlayType(selectionMode)}>
              {children}
            </Action>
          </Action>
        </PropsContextProvider>
      </Aria.MenuSection>
    );
  },
);
