import { useEffect, useRef } from "react";
import { announce } from "@react-aria/live-announcer";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "./../locales/*.locale.json";

/**
 * Announces the current validation message — which rule the password misses, or
 * that it is secure.
 *
 * The same text is wired to the field via `aria-describedby`, but a description
 * is only read when the field receives focus. The field keeps focus while the
 * password is typed, so without a live region a screen reader reports the field
 * as invalid and never says why.
 *
 * @internal
 */
export const useAriaAnnounceValidationState = (
  text: string | undefined,
  isAnnounceable: boolean,
): void => {
  const lastAnnouncedText = useRef<string>(undefined);

  useEffect(() => {
    if (!isAnnounceable || !text) {
      // Announce the text again when it comes back after an empty field or a
      // pending validation.
      lastAnnouncedText.current = undefined;
      return;
    }

    if (text === lastAnnouncedText.current) {
      return;
    }

    lastAnnouncedText.current = text;
    announce(text, "polite");
  }, [text, isAnnounceable]);
};

/**
 * Announces that the password became visible or hidden. The toggle button keeps
 * focus, and a screen reader does not report that the input switched between
 * masked characters and plain text on its own.
 *
 * @internal
 */
export const useAriaAnnouncePasswordVisibility = (
  isRevealed: boolean,
): void => {
  const formatter = useLocalizedStringFormatter(
    locales,
    "PasswordCreationField",
  );
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    announce(
      formatter.format(
        isRevealed ? "password.announce.revealed" : "password.announce.hidden",
      ),
      "polite",
    );
  }, [isRevealed]);
};
