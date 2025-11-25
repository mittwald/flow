import { FormContextProvider } from "@/integrations/react-hook-form/components/context/formContext";
import {
  type ComponentProps,
  type FC,
  type FormEvent,
  type FormEventHandler,
  type PropsWithChildren,
  type RefObject,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { FormProvider as RhfFormContextProvider } from "react-hook-form";
import { useObjectRef } from "@react-aria/utils";
import { useRegisterActionStateContext } from "@/integrations/react-hook-form/components/Form/lib/useRegisterActionStateContext";

export type FormOnSubmitHandler<F extends FieldValues> = SubmitHandler<F>;

type FormComponentType = FC<
  PropsWithChildren<{
    id: string;
    onSubmit?: FormEventHandler | FormOnSubmitHandler<never>;
    ref?: RefObject<HTMLFormElement | null>;
  }>
>;

export interface FormProps<F extends FieldValues>
  extends Omit<ComponentProps<"form">, "onSubmit">,
    PropsWithChildren {
  form: UseFormReturn<F>;
  onSubmit: FormOnSubmitHandler<F>;
  formComponent?: FC<Omit<FormComponentType, "ref">>;
  isReadOnly?: boolean;
}

const DefaultFormComponent: FormComponentType = (p) => <form {...p} />;

export function Form<F extends FieldValues>(props: FormProps<F>) {
  const {
    form,
    children,
    onSubmit,
    formComponent: FormView = DefaultFormComponent,
    isReadOnly: isReadOnlyFromProps,
    ref,
    ...formProps
  } = props;

  const [readonlyContextState, setReadOnlyContextState] =
    useState(!!isReadOnlyFromProps);

  const formId = useId();
  const FormViewComponent = useMemo(() => FormView, [formId]);

  const formRef = useObjectRef(ref);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const isReadOnly = isReadOnlyFromProps || readonlyContextState;

  const { action, registerSubmitResult, callAfterSubmit } =
    useRegisterActionStateContext(form);
  const currentActionState = action.state.useValue();

  const handleOnSubmit = (e?: FormEvent<HTMLFormElement> | F) => {
    const { isSubmitting, isValidating } = form.control._formState;
    const formEvent =
      e && "nativeEvent" in e ? (e as FormEvent<HTMLFormElement>) : undefined;

    formEvent?.stopPropagation();

    if (isSubmitting || isValidating) {
      formEvent?.preventDefault();
      return;
    }

    const submit = form.handleSubmit((values) => {
      setReadOnlyContextState(true);
      const result = onSubmit(values, formEvent);
      registerSubmitResult(result);
      return result;
    });

    return submit(formEvent).finally(() => {
      setReadOnlyContextState(false);
    });
  };

  const lastActionState = useRef<string>(currentActionState);
  useEffect(() => {
    if (
      currentActionState === "isIdle" &&
      lastActionState.current === "isSucceeded"
    ) {
      callAfterSubmit();
    }
    lastActionState.current = currentActionState;
  }, [currentActionState]);

  return (
    <RhfFormContextProvider {...form}>
      <FormContextProvider
        value={{
          form,
          id: formId,
          isReadOnly,
          setReadOnly: setReadOnlyContextState,
          submit: handleOnSubmit,
          submitButtonRef: submitButtonRef,
          formActionModel: action,
        }}
      >
        <FormViewComponent
          {...formProps}
          ref={formRef}
          id={formId}
          onSubmit={handleOnSubmit}
        >
          {children}
        </FormViewComponent>
      </FormContextProvider>
    </RhfFormContextProvider>
  );
}

export default Form;
