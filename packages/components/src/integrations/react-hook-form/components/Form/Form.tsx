import ConfirmUnsavedChangesModal from "@/components/Modal/components/ConfirmUnsavedChangesModal";
import { useHotkeySubmit } from "@/integrations/react-hook-form/components/Form/useHotkeySubmit";
import { FormContextProvider } from "@/integrations/react-hook-form/components/FormContextProvider/FormContextProvider";
import { flags } from "@/integrations/react-hook-form/flags";
import { useModalController } from "@/lib/controller";
import {
  type ComponentProps,
  type FC,
  type FormEvent,
  type FormEventHandler,
  type PropsWithChildren,
  type Ref,
  useId,
  useMemo,
  useRef,
} from "react";
import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { FormProvider as RhfFormContextProvider } from "react-hook-form";

export type FormOnSubmitHandler<F extends FieldValues> = SubmitHandler<F>;

export type AfterFormSubmitCallback = (...unknownArgs: unknown[]) => unknown;

export interface FormAutoResetOptions {
  onAfterModalClose?: boolean;
}

type FormComponentType = FC<
  PropsWithChildren<{
    id: string;
    onSubmit?: FormEventHandler | FormOnSubmitHandler<never>;
    ref?: Ref<HTMLFormElement>;
  }>
>;

export interface FormProps<F extends FieldValues>
  extends Omit<ComponentProps<"form">, "onSubmit">, PropsWithChildren {
  form: UseFormReturn<F>;
  onSubmit: FormOnSubmitHandler<F>;
  formComponent?: FC<Omit<FormComponentType, "ref">>;
  isReadOnly?: boolean;
  autoReset?: FormAutoResetOptions | boolean;
}

const DefaultFormComponent: FormComponentType = (p) => <form {...p} />;

export function Form<F extends FieldValues>(props: FormProps<F>) {
  const {
    form,
    children,
    onSubmit,
    formComponent = DefaultFormComponent,
    isReadOnly,
    ref,
    id: idProp,
    autoReset = true,
    ...formProps
  } = props;

  const newFormId = useId();
  const formId = idProp ?? newFormId;
  const FormComponent = useMemo(() => formComponent, [formId]);
  const afterSubmitCallback = useRef<AfterFormSubmitCallback>(undefined);
  const { isSubmitting, isValidating, isDirty } = form.formState;

  const autoResetOptions =
    typeof autoReset === "boolean"
      ? { onAfterModalClose: autoReset }
      : autoReset;

  const modalController = useModalController();
  modalController.useUpdateOptions({
    confirmOnClose:
      flags.requireCloseModalConfirmationOnUnsavedChanges && isDirty,
    onClose: () => {
      if (autoResetOptions?.onAfterModalClose) {
        form.reset();
      }
    },
  });

  const handleSubmitResult = (result: unknown) => {
    if (typeof result === "function") {
      afterSubmitCallback.current = result as AfterFormSubmitCallback;
    }
  };

  const handleSubmit = (e?: FormEvent | F) => {
    const formEvent = e && "nativeEvent" in e ? (e as FormEvent) : undefined;
    formEvent?.stopPropagation();
    if (isSubmitting || isValidating) {
      return;
    }
    modalController.confirmClose();
    return form.handleSubmit((values, event) => {
      const submitResult = onSubmit(values, event);
      if (submitResult instanceof Promise) {
        return submitResult.then(handleSubmitResult);
      }
      handleSubmitResult(submitResult);
    })(formEvent);
  };

  const onAfterSuccessFeedback = () => {
    afterSubmitCallback.current?.();
  };

  const refWithHotkeySubmit = useHotkeySubmit({
    ref,
    handleSubmit,
  });

  return (
    <RhfFormContextProvider {...form}>
      <FormContextProvider
        form={form as UseFormReturn}
        isReadOnly={isReadOnly}
        id={formId}
        onAfterSuccessFeedback={onAfterSuccessFeedback}
      >
        <FormComponent
          {...formProps}
          ref={refWithHotkeySubmit}
          id={formId}
          onSubmit={handleSubmit}
        >
          {children}
        </FormComponent>
      </FormContextProvider>
      <ConfirmUnsavedChangesModal />
    </RhfFormContextProvider>
  );
}

export default Form;
