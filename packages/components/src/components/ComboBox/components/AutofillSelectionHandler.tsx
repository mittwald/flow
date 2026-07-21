import type { RefObject } from "react";
import { useContext, useEffect, useRef } from "react";
import { ComboBoxStateContext } from "react-aria-components";
import type { CollectionLike } from "../lib/autofillMatching";
import { collectItemNodes, findMatchingKey } from "../lib/autofillMatching";

/**
 * Name of the marker animation defined in ComboBox.module.scss. The animation
 * is attached to the input via the :autofill / :-webkit-autofill pseudo
 * classes, so its animationstart event tells us that the browser has autofilled
 * the input.
 */
export const autofillAnimationName = "flow-combobox-autofill-start";

interface Props {
  inputRef: RefObject<HTMLInputElement | null>;
}

/**
 * Workaround for browser autofill being ignored by the ComboBox
 * (https://github.com/mittwald/flow/issues/2173).
 *
 * React-aria fully controls the input value of its ComboBox, so values written
 * by the browser's autofill never lead to a selection and are dropped during
 * validation and form submission
 * (https://github.com/adobe/react-spectrum/issues/9057).
 *
 * Autofill is detected via two mechanisms:
 *
 * 1. An animationstart event of a marker animation attached to the :autofill /
 *    :-webkit-autofill pseudo classes (Chrome, Edge, Safari)
 * 2. As a fallback, trusted native input events on an unfocused input, which
 *    cannot originate from user typing (Firefox)
 *
 * Committing the value is a two-step process, because react-aria's
 * ComboBoxState only exposes the _displayed_ collection, which stays empty
 * until the menu has been opened for the first time (the state freezes a
 * "lastCollection" snapshot while closed). Therefore:
 *
 * 1. On detection, the raw value is synced into the react-aria state and the menu
 *    is opened programmatically (trigger "manual", which makes the state expose
 *    the full, unfiltered collection).
 * 2. Once the collection is available, the value is matched against the options.
 *    On a match, setSelectedKey() commits the selection; react-aria then syncs
 *    the input text and closes the menu on its own. Without a match, the menu
 *    is closed again and the raw text is kept, so validation can flag the value
 *    instead of silently dropping it.
 *
 * This component can be removed once the upstream issue is resolved.
 */
export const AutofillSelectionHandler = ({ inputRef }: Props) => {
  const state = useContext(ComboBoxStateContext);
  const pendingAutofillValue = useRef<string | null>(null);

  // Step 1: detect autofill, sync raw value, open the menu
  useEffect(() => {
    const input = inputRef.current;
    if (!input || !state) {
      return;
    }

    const handleAutofill = () => {
      const value = input.value;
      if (!value.trim() || input.disabled || input.readOnly) {
        return;
      }
      if (state.selectedKey !== null && state.selectedKey !== undefined) {
        // Do not override a selection made by the user
        return;
      }

      // Keep the react-aria state in sync with the DOM, so the value is
      // never silently lost
      state.setInputValue(value);

      const directMatch = findMatchingKey(
        state.collection as CollectionLike,
        value,
      );
      if (directMatch !== null) {
        // Collection already populated (menu was open before)
        state.setSelectedKey(directMatch);
        return;
      }

      // The displayed collection is still empty. Open the menu with
      // trigger "manual" so react-aria exposes the full collection, then
      // finish in the effect below.
      pendingAutofillValue.current = value;
      state.open(null, "manual");
    };

    const handleAnimationStart = (event: AnimationEvent) => {
      if (event.animationName !== autofillAnimationName) {
        return;
      }
      // The autofilled value is not always readable synchronously
      requestAnimationFrame(handleAutofill);
    };

    const handleInput = (event: Event) => {
      if (!event.isTrusted) {
        return;
      }
      if (document.activeElement === input) {
        // Regular typing is handled by react-aria itself
        return;
      }
      handleAutofill();
    };

    input.addEventListener("animationstart", handleAnimationStart);
    input.addEventListener("input", handleInput);

    return () => {
      input.removeEventListener("animationstart", handleAnimationStart);
      input.removeEventListener("input", handleInput);
    };
  }, [state, inputRef]);

  // Step 2: once the collection is available, match and commit
  useEffect(() => {
    if (!state) {
      return;
    }
    const pendingValue = pendingAutofillValue.current;
    if (pendingValue === null || !state.isOpen) {
      return;
    }

    const collection = state.collection as CollectionLike;
    const items = collectItemNodes(
      collection,
      collection.getChildren?.bind(collection),
    );
    if (items.length === 0) {
      // Collection not built yet (or there are no options at all); the
      // effect re-runs when the collection updates
      return;
    }

    pendingAutofillValue.current = null;

    const matchingKey = findMatchingKey(collection, pendingValue);
    if (matchingKey !== null) {
      // react-aria closes the menu and syncs the input text on its own
      state.setSelectedKey(matchingKey);
    } else {
      // No matching option: close the menu again and keep the raw text,
      // so required/validation logic sees the value instead of an empty
      // input (close() resets the input, therefore re-sync afterwards)
      state.close();
      state.setInputValue(pendingValue);
    }
  });

  return null;
};
