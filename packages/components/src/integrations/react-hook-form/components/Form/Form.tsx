import ConfirmUnsavedChangesModal from "@/components/Modal/components/ConfirmUnsavedChangesModal";
import { FormContextProvider } from "@/integrations/react-hook-form/components/FormContextProvider/FormContextProvider";
import { flags } from "@/integrations/react-hook-form/flags";
import { useModalController } from "@/lib/controller";
import {
  type BaseSyntheticEvent,
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  type Ref,
  type SubmitEventHandler,
  useId,
  useMemo,
  useRef,
} from "react";
import type {
  FieldValues,
  Path,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { FormProvider as RhfFormContextProvider } from "react-hook-form";
import { useFormRootErrorController } from "../FormRootError/useFormRootErrorController";
import { FormRootError } from "../../lib/FormRootError";
import { useFormSettings } from "../FormSettingsProvider/FormSettingsProvider";
import {
  useFormSubmitController,
  type WithFormSubmitControllerProps,
} from "@/integrations/react-hook-form/components/Form/hooks/useFormSubmitController";
import { useHotkeySubmit } from "@/integrations/react-hook-form/components/Form/hooks/useHotkeySubmit";

export type FormOnSubmitHandler<F extends FieldValues> = SubmitHandler<F>;

export type AfterFormSubmitCallback = (...unknownArgs: unknown[]) => unknown;

export interface FormAutoResetOptions {
  onAfterModalClose?: boolean;
}

type FormComponentType = FC<
  PropsWithChildren<{
    id: string;
    onSubmit?: SubmitEventHandler | FormOnSubmitHandler<never>;
    ref?: Ref<HTMLFormElement>;
  }>
>;

export interface FormProps<F extends FieldValues>
  extends
    Omit<ComponentProps<"form">, "onSubmit">,
    PropsWithChildren,
    WithFormSubmitControllerProps {
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
    onSubmit: onSubmitProp,
    formComponent = DefaultFormComponent,
    isReadOnly,
    ref,
    id: idProp,
    autoReset = true,
    submitController: submitControllerFromProps,
    ...formProps
  } = props;

  const newFormId = useId();
  const formId = idProp ?? newFormId;
  const FormComponent = useMemo(() => formComponent, [formId]);
  const afterSubmitCallback = useRef<AfterFormSubmitCallback>(undefined);
  const { isSubmitting, isValidating, isDirty } = form.formState;
  const rootErrorController = useFormRootErrorController();

  const defaultSubmitController = useFormSubmitController();
  const submitController = submitControllerFromProps
    ? submitControllerFromProps.submit.extend(defaultSubmitController)
    : defaultSubmitController;

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

  const { submitInterceptor } = useFormSettings();
  const onSubmit = submitInterceptor
    ? (values: F) => submitInterceptor<F>(onSubmitProp, values, { form })
    : onSubmitProp;

  const handleSubmitResult = (result: unknown) => {
    if (typeof result === "function") {
      afterSubmitCallback.current = result as AfterFormSubmitCallback;
    }
    const rootError = form.getFieldState("root" as Path<F>)?.error;
    if (rootError && !rootErrorController.errorComponentMounted) {
      throw new FormRootError(rootError);
    }
  };

  const handleSubmit = (e?: BaseSyntheticEvent | F) => {
    const formEvent =
      e && "nativeEvent" in e ? (e as BaseSyntheticEvent) : undefined;

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
  submitController.submit.set(handleSubmit);

  const onAfterSuccessFeedback = () => {
    afterSubmitCallback.current?.();
  };

  const refWithHotkeySubmit = useHotkeySubmit({
    ref,
    submitController,
  });

  return (
    <RhfFormContextProvider {...form}>
      <FormContextProvider
        form={form as UseFormReturn}
        isReadOnly={isReadOnly}
        id={formId}
        onAfterSuccessFeedback={onAfterSuccessFeedback}
        rootErrorController={rootErrorController}
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
