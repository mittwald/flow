import locales from "../locales/*.locale.json";
import { useEffect } from "react";
import { useLiveRegion } from "@chakra-ui/live-region";
import type { ActionStateValue } from "@/components/Action/models/ActionState";
import useLocalizedStringFormatter from "@/lib/i18n/useLocalizedStringFormatter";

interface Options {
  isPendingText?: string;
  isSucceededText?: string;
  isFailedText?: string;
}

export const useAriaAnnounceActionState = (
  actionState: ActionStateValue,
  options: Options = {},
): void => {
  const formater = useLocalizedStringFormatter(locales);

  const {
    isPendingText = formater.format("action.isPending"),
    isSucceededText = formater.format("action.isSucceeded"),
    isFailedText = formater.format("action.isFailed"),
  } = options;

  const liveRegion = useLiveRegion({
    "aria-live": "polite",
    "aria-atomic": false,
    "aria-relevant": "text additions",
    role: "status",
  });

  useEffect(() => {
    if (actionState === "isPending") {
      liveRegion.speak(isPendingText);
    } else if (actionState === "isSucceeded") {
      liveRegion.speak(isSucceededText);
    } else if (actionState === "isFailed") {
      liveRegion.speak(isFailedText);
    }
  }, [actionState]);
};
