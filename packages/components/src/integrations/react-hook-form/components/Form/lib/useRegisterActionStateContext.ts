import { ActionModel } from "@/components/Action/models/ActionModel";
import { useEffect, useRef } from "react";
import { isPromise } from "remeda";
import type { FieldValues, UseFormReturn } from "react-hook-form";

const callAfterSubmitFunction = (result: unknown) => {
  const callFn = (something: unknown) => {
    if (typeof something === "function") {
      something();
    }
  };

  if (result instanceof Promise) {
    result.then(callFn);
  } else {
    callFn(result);
  }
};

export const useRegisterActionStateContext = <T extends FieldValues>(
  form: UseFormReturn<T>,
) => {
  const action = ActionModel.useNew({});
  const trackedSubmitCount = useRef(0);
  const submitHandlerResultRef = useRef<unknown>(null);

  useEffect(() => {
    return form.subscribe({
      formState: {
        errors: true,
        isValid: true,
      },
      callback: ({
        isValid,
        isSubmitted = false,
        isSubmitSuccessful = false,
        submitCount = 0,
        errors,
      }) => {
        if (submitCount === 0 && trackedSubmitCount.current > 0) {
          trackedSubmitCount.current = 0;
        }

        if (trackedSubmitCount.current === submitCount) {
          return;
        }
        trackedSubmitCount.current = submitCount;

        if (isSubmitted) {
          if (isSubmitSuccessful) {
            void action.state.onSucceeded();

            if (isValid) {
              callAfterSubmitFunction(submitHandlerResultRef.current);
            }
          } else {
            const hasFailedWithError =
              isSubmitted && errors && Object.entries(errors).length > 0
                ? errors
                : undefined;

            void action.state.onFailed(hasFailedWithError);
          }
        }
      },
    });
  }, [form.subscribe, action.state]);

  const registerSubmitResult = (result: unknown) => {
    if (isPromise(result)) {
      void action.state.onAsyncStart();
      result.then((submitResult) => {
        submitHandlerResultRef.current = submitResult;
      });
    } else {
      submitHandlerResultRef.current = result;
    }
  };

  return {
    action,
    registerSubmitResult,
    callAfterSubmitFunction,
  } as const;
};
