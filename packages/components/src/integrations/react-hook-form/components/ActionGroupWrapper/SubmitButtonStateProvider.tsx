import type { FC, MutableRefObject, PropsWithChildren } from "react";
import React from "react";
import { ActionStateContext } from "~/components/Action/ActionStateContext";
import { useFormContext } from "~/integrations/react-hook-form/components/context/formContext";
import { useFormState } from "react-hook-form";
import type { PropsContext } from "~/lib/propsContext";
import { dynamic, PropsContextProvider } from "~/lib/propsContext";

interface Props extends PropsWithChildren {
  isAsyncSubmit: MutableRefObject<boolean>;
}

const ActionStateContextWrapper: FC<Props> = (props) => {
  const { children, isAsyncSubmit } = props;

  const form = useFormContext().form;

  const { isSubmitted, isSubmitting, isSubmitSuccessful, errors } =
    useFormState(form);

  const submitErrors =
    isSubmitted && errors && Object.entries(errors).length > 0
      ? errors
      : undefined;

  const submitSucceeded = isSubmitted && isSubmitSuccessful;

  return (
    <ActionStateContext
      isStarted={isSubmitting && isAsyncSubmit.current}
      hasFailedWithError={submitErrors}
      hasSucceeded={submitSucceeded}
    >
      {children}
    </ActionStateContext>
  );
};

export const SubmitButtonStateProvider: FC<Props> = (props) => {
  const { children, isAsyncSubmit } = props;

  const propsContext: PropsContext = {
    ActionGroup: {
      children: dynamic((p) => (
        <ActionStateContextWrapper isAsyncSubmit={isAsyncSubmit}>
          {p.children}
        </ActionStateContextWrapper>
      )),
    },
  };

  return (
    <PropsContextProvider props={propsContext} mergeInParentContext>
      {children}
    </PropsContextProvider>
  );
};
