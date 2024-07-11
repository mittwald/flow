import * as Aria from "react-aria-components";
import type { PropsWithChildren } from "react";
import React from "react";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import styles from "../../ContextMenu.module.scss";

export type ContextMenuSectionProps = PropsWithChildren & FlowComponentProps;
export const ContextMenuSection = flowComponent(
  "ContextMenuSection",
  (props) => {
    const { children } = props;

    const propsContext: PropsContext = {
      Heading: {
        level: 5,
        wrapWith: <Aria.Header />,
      },
    };

    return (
      <Aria.Section className={styles.section}>
        <PropsContextProvider props={propsContext} mergeInParentContext>
          {children}
        </PropsContextProvider>
      </Aria.Section>
    );
  },
);
