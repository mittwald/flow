import { ActionModel } from "@/components/Action/models/ActionModel";
import { useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";

interface Options {
  form: UseFormReturn;
  setReadOnly: (isReadOnly: boolean) => void;
}

export const useFormSubmitAction = (options: Options) => {
  const { form, setReadOnly } = options;

  const formSubmitAction = ActionModel.useNew({});

  const { isSubmitting, isSubmitted, isSubmitSuccessful } = form.formState;
  const wasSubmitting = useRef(isSubmitting);

  useEffect(() => {
    const submittingDone = wasSubmitting.current && !isSubmitting;
    wasSubmitting.current = isSubmitting;

    if (isSubmitting) {
      setReadOnly(true);
      formSubmitAction.state.onAsyncStart();
    } else if (submittingDone) {
      if (isSubmitSuccessful) {
        formSubmitAction.state.onSucceeded();
      } else {
        formSubmitAction.state.onFailed(new Error("Form submission failed"));
      }
      setReadOnly(false);
    }
  }, [
    wasSubmitting,
    isSubmitting,
    isSubmitted,
    isSubmitSuccessful,
    formSubmitAction,
    setReadOnly,
  ]);

  return formSubmitAction;
};
