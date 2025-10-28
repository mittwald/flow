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
  const formatter = useLocalizedStringFormatter(locales);

  const {
    isPendingText = formatter.format("action.isPending"),
    isSucceededText = formatter.format("action.isSucceeded"),
    isFailedText = formatter.format("action.isFailed"),
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

export const useAriaAnnounceSuspense = () => {
  const formatter = useLocalizedStringFormatter(locales);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const isPendingText = formatter.format("suspense.isPending");
      announce(isPendingText, "polite");
    }, 750);

    return () => {
      clearTimeout(timeout);
    };
  }, []);
};
