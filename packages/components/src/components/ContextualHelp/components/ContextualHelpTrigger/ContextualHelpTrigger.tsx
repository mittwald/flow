import * as Aria from "react-aria-components";
import type { OverlayTriggerProps } from "@/components/OverlayTrigger";
import { OverlayTrigger } from "@/components/OverlayTrigger";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { IconInfo } from "@/components/Icon/components/icons";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export type ContextualHelpTriggerProps = OverlayTriggerProps;

/** @flr-generate all */
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
        ariaSlot: null,
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

export default ContextualHelpTrigger;
