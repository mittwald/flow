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
  /**
   * The subject the contextual help is about — not a complete accessibility
   * label. It is inserted into the localized template "More information about
   * {subject}", which becomes the accessibility label of the trigger.
   */
  subject?: string;
  /**
   * A complete accessibility label for the trigger, replacing the label built
   * from `subject`. Prefer `subject`, which stays localized — reach for this
   * only when the template does not fit.
   */
  "aria-label"?: string;
}

/** @flr-generate all */
export const ContextualHelpTrigger = flowComponent(
  "ContextualHelpTrigger",
  (props) => {
    const {
      children,
      subject,
      "aria-label": ariaLabelFromProps,
      ...triggerProps
    } = props;
    const stringFormatter = useLocalizedStringFormatter(
      locales,
      "ContextualHelpTrigger",
    );

    const ariaLabel =
      ariaLabelFromProps ??
      (subject === undefined
        ? stringFormatter.format("moreInformation")
        : stringFormatter.format("moreInformationAbout", { subject }));

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
