import { ActionModel } from "@/components/Action/models/ActionModel";
import { useStatic } from "@/lib/hooks/useStatic";
import { useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";

interface Options {
  form: UseFormReturn;
  setReadOnly: (isReadOnly: boolean) => void;
}

export const useFormSubmitAction = (options: Options) => {
  const { form, setReadOnly } = options;

  const submitPromise = useStatic(() => Promise.withResolvers<void>());

  const formSubmitAction = ActionModel.useNew({
    onAction: () => submitPromise.promise,
  });

  const { isSubmitting, isSubmitted, isSubmitSuccessful } = form.formState;
  const wasSubmitting = useRef(isSubmitting);

  useEffect(() => {
    const submittingDone = wasSubmitting.current && !isSubmitting;
    wasSubmitting.current = isSubmitting;

    if (isSubmitting) {
      setReadOnly(true);
    } else if (submittingDone) {
      if (isSubmitSuccessful) {
        submitPromise.resolve();
      } else {
        submitPromise.reject(new Error("Form submission failed"));
      }
      setReadOnly(false);
    }
  }, [
    wasSubmitting,
    isSubmitting,
    isSubmitted,
    isSubmitSuccessful,
    setReadOnly,
    submitPromise,
  ]);

  return formSubmitAction;
};
