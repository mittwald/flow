import { type FC, useRef } from "react";
import { useVisuallyHidden } from "react-aria";
import { IconAttachment } from "@/components/Icon/components/icons";
import { ToolbarButton } from "@/components/MarkdownEditor/components/ToolbarButton";

/** @internal */
export interface AttachmentButtonProps {
  /** Which file types to offer, as an `accept` attribute value. */
  accept?: string;
  isDisabled?: boolean;
  /** Called with the files the user picked. */
  onSelect: (files: File[]) => void;
}

/**
 * The toolbar's file picker — the keyboard and pointer equivalent of dropping a
 * file onto the editor. A `ToolbarButton` like every other tool, plus the
 * hidden input it opens.
 *
 * @internal
 */
export const AttachmentButton: FC<AttachmentButtonProps> = (props) => {
  const { accept, isDisabled, onSelect } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const { visuallyHiddenProps } = useVisuallyHidden();

  const handlePress = () => {
    const input = inputRef.current;

    if (!input) {
      return;
    }

    /*
     * Cleared first: an input that still holds the previous file fires no
     * `change` when the same file is picked again.
     */
    input.value = "";
    input.click();
  };

  return (
    <>
      <ToolbarButton
        type="attachment"
        isDisabled={isDisabled}
        onPress={handlePress}
      >
        <IconAttachment />
      </ToolbarButton>

      {/*
       * A plain input rather than `FileField`'s `FileInput`: that one renders an
       * `Aria.Input`, which reads the `InputContext` the surrounding TextArea's
       * `Aria.TextField` provides and would be handed the editor's text as its
       * value — which a file input rejects outright.
       *
       * `tabIndex={-1}` keeps the hidden input out of the tab order; the button
       * in front of it is the focusable affordance.
       */}
      <input
        {...visuallyHiddenProps}
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        tabIndex={-1}
        onChange={(event) => {
          const files = event.target.files;

          if (files?.length) {
            onSelect(Array.from(files));
          }
        }}
      />
    </>
  );
};
