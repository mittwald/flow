import { useLocalizedStringFormatter } from "react-aria";
import locales from "../locales/*.locale.json";
import { useEffect } from "react";
import type { ActionStateValue } from "@/components/Action/models/ActionState";
import { announce } from "@react-aria/live-announcer";

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

  useEffect(() => {
    if (actionState === "isPending") {
      announce(isPendingText, "polite");
    } else if (actionState === "isSucceeded") {
      announce(isSucceededText, "polite");
    } else if (actionState === "isFailed") {
      announce(isFailedText, "polite");
    }
  }, [actionState]);
};
