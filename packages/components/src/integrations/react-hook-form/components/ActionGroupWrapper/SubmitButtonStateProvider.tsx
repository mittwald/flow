import type { FC, MutableRefObject, PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { ActionStateContext } from "@/components/Action/ActionStateContext";
import { useFormContext } from "@/integrations/react-hook-form/components/context/formContext";

interface Props extends PropsWithChildren {
  isAsyncSubmit: MutableRefObject<boolean>;
}

const ActionStateContextWrapper: FC<Props> = (props) => {
  const { children, isAsyncSubmit } = props;

  const form = useFormContext().form;

  const [submitErrors, setSubmitErrors] = useState<unknown>(undefined);
  const [hasSucceeded, setHasSucceeded] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    /**
     * The mapping into sepearte states inside this effect is required, because
     * otherwise the reset() function of RHF does not work as expected
     * (subsequent resets not working, default values are not correctly re-used,
     * ...).
     *
     * A side note: This only happens if 'isSubmitted' and/or 'isSubmitting' are
     * extracted from the form state.
     */
    const { isSubmitted, isSubmitting, isSubmitSuccessful, errors } =
      form.formState;

    setSubmitErrors(
      isSubmitted && errors && Object.entries(errors).length > 0
        ? errors
        : undefined,
    );
    setHasSucceeded(isSubmitted && isSubmitSuccessful);
    setIsStarted(isSubmitting && isAsyncSubmit.current);
  }, [form.formState, isAsyncSubmit.current]);

  return (
    <ActionStateContext
      isStarted={isStarted}
      hasFailedWithError={submitErrors}
      hasSucceeded={hasSucceeded}
    >
      {children}
    </ActionStateContext>
  );
};

export const SubmitButtonStateProvider: FC<Props> = (props) => {
  const { children, isAsyncSubmit } = props;

  return (
    <ActionStateContextWrapper isAsyncSubmit={isAsyncSubmit}>
      {children}
    </ActionStateContextWrapper>
  );
};
