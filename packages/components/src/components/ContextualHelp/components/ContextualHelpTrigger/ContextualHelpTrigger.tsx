import * as Aria from "react-aria-components";
import type { OverlayTriggerProps } from "@/components/OverlayTrigger";
import { OverlayTrigger } from "@/components/OverlayTrigger";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import { IconInfo } from "@/components/Icon/components/icons";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface ContextualHelpTriggerProps extends OverlayTriggerProps {
  label?: string;
}

/** @flr-generate all */
export const ContextualHelpTrigger = flowComponent(
  "ContextualHelpTrigger",
  (props) => {
    const { children, label, ...triggerProps } = props;
    const stringFormatter = useLocalizedStringFormatter(
      locales,
      "ContextualHelpTrigger",
    );

    const ariaLabel =
      label !== undefined
        ? stringFormatter.format("moreInformationAbout", { label })
        : stringFormatter.format("moreInformation");

    const propsContext: PropsContext = {
      Button: {
        "aria-label": ariaLabel,
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
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </OverlayTrigger>
    );
  },
  { type: "provider" },
);

export default ContextualHelpTrigger;
