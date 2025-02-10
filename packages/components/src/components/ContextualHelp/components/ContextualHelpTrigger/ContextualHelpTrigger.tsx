import * as Aria from "react-aria-components";
import React from "react";
import { OverlayTrigger } from "@/components/OverlayTrigger";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import locales from "./locales/*.locale.json";
import useLocalizedStringFormatter from "@/lib/i18n/useLocalizedStringFormatter";
import { IconInfo } from "@/components/Icon/components/icons";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export const ContextualHelpTrigger = flowComponent(
  "ContextualHelpTrigger",
  (props) => {
    const { children, ...triggerProps } = props;
    const stringFormatter = useLocalizedStringFormatter(locales);

    const propsContext: PropsContext = {
      Button: {
        "aria-label": stringFormatter.format(
          "contextualHelpButton.moreInformation",
        ),
        children: <IconInfo />,
        size: "s",
        variant: "plain",
      },
    };

    return (
      <OverlayTrigger
        overlayType="ContextualHelp"
        {...triggerProps}
        component={Aria.DialogTrigger}
      >
        <PropsContextProvider props={propsContext} mergeInParentContext>
          {children}
        </PropsContextProvider>
      </OverlayTrigger>
    );
  },
);
