import type { ActionProps } from "@/components/Action";
import { ActionModel } from "@/components/Action/models/ActionModel";
import { MutedActionError } from "@/components/Action/MutedActionError";
import { useEffect, useRef } from "react";
import type { FieldValues, FormState } from "react-hook-form";

export const useFormSubmitAction = (
  formState: FormState<FieldValues>,
  actionProps?: ActionProps,
) => {
  const { isSubmitting, isSubmitSuccessful } = formState;

  const submitPromise = useRef<PromiseWithResolvers<void>>(undefined);

  const formSubmitAction = ActionModel.useNew({
    ...actionProps,
    onAction: () => {
      submitPromise.current = Promise.withResolvers<void>();
      actionProps?.onAction?.();
      return submitPromise.current.promise;
    },
  });

  useEffect(() => {
    if (isSubmitting) {
      if (!formSubmitAction.state.isBusy) {
        /**
         * Manually start execution. This happens if the form submission was
         * triggered by other means than the submit button, e.g. by pressing
         * Enter in a text field.
         */
        formSubmitAction.execute();
      }
      return;
    }

    if (isSubmitSuccessful) {
      submitPromise.current?.resolve();
      return;
    }

    submitPromise.current?.reject(
      new MutedActionError("Form submission failed"),
    );
  }, [isSubmitting, isSubmitSuccessful, submitPromise]);

  return formSubmitAction;
};
