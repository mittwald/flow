import * as Aria from "react-aria-components";
import type { FC } from "react";
import React from "react";
import type { OverlayTriggerProps } from "@/components/OverlayTrigger";
import { OverlayTrigger } from "@/components/OverlayTrigger";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { IconInfo } from "@/components/Icon/components/icons";

type Props = Omit<OverlayTriggerProps, "overlayType">;

export const ContextualHelpTrigger: FC<Props> = (props) => {
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
    <OverlayTrigger overlayType="ContextualHelp" {...triggerProps}>
      <Aria.DialogTrigger>
        <PropsContextProvider props={propsContext} mergeInParentContext>
          {children}
        </PropsContextProvider>
      </Aria.DialogTrigger>
    </OverlayTrigger>
  );
};
