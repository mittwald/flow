import type { Ref } from "react";
import { useObjectRef } from "react-aria";
import { useHotkeys } from "react-hotkeys-hook";
import { useMergeRefs } from "use-callback-ref";
import type { WithFormSubmitControllerProps } from "@/integrations/react-hook-form";

interface Options extends Required<WithFormSubmitControllerProps> {
  ref: Ref<HTMLFormElement> | undefined;
}

export const useHotkeySubmit = (options: Options) => {
  const { ref, submitController } = options;

  return useMergeRefs([
    useObjectRef(ref),
    useHotkeys<never>("mod+enter", submitController.submit, {
      enableOnFormTags: true,
      enableOnContentEditable: true,
    }),
  ]);
};
