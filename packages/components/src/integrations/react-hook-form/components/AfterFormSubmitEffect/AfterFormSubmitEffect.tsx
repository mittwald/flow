import { useFormContext } from "@/integrations/react-hook-form/components/context/formContext";
import type { FC, RefObject } from "react";
import { useEffect } from "react";
import { useFormState } from "react-hook-form";

interface Props {
  submitHandlerResultRef: RefObject<unknown>;
}

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

/**
 * This effect has its own component to prevent unnecessary re-renders of the
 * entire form when the form state changes (useFormState).
 *
 * This component mimics the required effect to reset a form after submit with a
 * simpler to use callback function. See the React Hook docs about resetting
 * form on submit: https://arc.net/l/quote/zslpdgfz
 */
export const AfterFormSubmitEffect: FC<Props> = (props) => {
  const { submitHandlerResultRef } = props;
  const form = useFormContext().form;
  const { isValid, isSubmitSuccessful } = useFormState(form);

  useEffect(() => {
    if (isSubmitSuccessful && isValid) {
      callAfterSubmitFunction(submitHandlerResultRef.current);
    }
  }, [isSubmitSuccessful, isValid, form]);

  return null;
};
