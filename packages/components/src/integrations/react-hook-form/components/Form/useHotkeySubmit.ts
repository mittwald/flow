import type { Ref } from "react";
import { useObjectRef } from "react-aria";
import { useHotkeys } from "react-hotkeys-hook";
import { useMergeRefs } from "use-callback-ref";

interface Options {
  ref: Ref<HTMLFormElement> | undefined;
  handleSubmit: () => void;
}

export const useHotkeySubmit = (options: Options) => {
  const { ref, handleSubmit } = options;

  return useMergeRefs([
    useObjectRef(ref),
    useHotkeys<never>("mod+enter", handleSubmit, {
      enableOnFormTags: true,
      enableOnContentEditable: true,
    }),
  ]);
};
