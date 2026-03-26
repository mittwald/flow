import { useRef } from "react";

export type FormSubmitController = ReturnType<typeof useFormSubmitController>;

export interface WithFormSubmitControllerProps {
  submitController?: FormSubmitController;
}

export const useFormSubmitController = () => {
  const submitHandler = useRef<() => Promise<void> | void>(async () => {
    /* empty */
  });

  const fn = async () => {
    await submitHandler.current();
  };

  const formSubmitControllerReturn = {
    submit: fn,
  };

  fn.set = (newSubmitHandler: () => Promise<void> | void) => {
    submitHandler.current = newSubmitHandler;
  };

  fn.extend = (submitController: FormSubmitController) => {
    const previous = submitHandler.current;

    submitHandler.current = async () => {
      await previous();
      await submitController.submit();
    };

    return formSubmitControllerReturn;
  };

  return formSubmitControllerReturn;
};
