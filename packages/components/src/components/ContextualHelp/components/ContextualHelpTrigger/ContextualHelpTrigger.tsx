import * as Aria from "react-aria-components";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import { OverlayTrigger } from "@/components/OverlayTrigger";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { IconInfo } from "@/components/Icon/components/icons";

type Props = PropsWithChildren;

export const ContextualHelpTrigger: FC<Props> = (props) => {
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
    <OverlayTrigger>
      <Aria.DialogTrigger>
        <PropsContextProvider props={propsContext} mergeInParentContext>
          {props.children}
        </PropsContextProvider>
      </Aria.DialogTrigger>
    </OverlayTrigger>
  );
};
