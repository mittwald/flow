import { FormContextProvider } from "@/integrations/react-hook-form/components/FormContextProvider/FormContextProvider";
import { useComponentDefaults } from "@/components/ComponentDefaultsProvider";
import { type OverlayController, useModalController } from "@/lib/controller";
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

/**
 * Runs `operation` while closing the surrounding Modal is allowed without a
 * confirmation, and drops that permission again as soon as the operation has
 * settled. Scoping it to the operation is what keeps a submit that only
 * advances a wizard step from disarming the confirmation for good (#2775).
 */
const runWithGrantedModalClose = (
  modalController: OverlayController,
  operation: () => unknown,
): unknown => {
  const releaseGrant = modalController.grantCloseWithoutConfirmation();

  let result: unknown;
  try {
    result = operation();
  } catch (error) {
    releaseGrant();
    throw error;
  }

  if (result instanceof Promise) {
    return result.finally(releaseGrant);
  }
  releaseGrant();
  return result;
};

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
  const { isDirty } = form.formState;
  const rootErrorController = useFormRootErrorController();

  const defaultSubmitController = useFormSubmitController();
  const submitController = submitControllerFromProps
    ? submitControllerFromProps.submit.extend(defaultSubmitController)
    : defaultSubmitController;

  const autoResetOptions =
    typeof autoReset === "boolean"
      ? { onAfterModalClose: autoReset }
      : autoReset;

  const { confirmModalCloseOnUnsavedChanges } = useComponentDefaults("Form");

  const modalController = useModalController();
  modalController.useUpdateOptions({
    // A dirty Form contributes one close confirmation source to the surrounding
    // Modal; sources are combined, so a clean Form does not overrule a
    // `<Modal confirmOnClose>`. The Modal renders the confirmation dialog.
    // An application that switched the default off contributes nothing at all.
    confirmOnClose: confirmModalCloseOnUnsavedChanges ? isDirty : undefined,
  });
  modalController.useOnClosed(() => {
    if (autoResetOptions?.onAfterModalClose) {
      form.reset();
    }
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

    return form.handleSubmit((values, event) =>
      runWithGrantedModalClose(modalController, () => {
        const submitResult = onSubmit(values, event);
        if (submitResult instanceof Promise) {
          return submitResult.then(handleSubmitResult);
        }
        handleSubmitResult(submitResult);
      }),
    )(formEvent);
  };
  submitController.submit.set(handleSubmit);

  const onAfterSuccessFeedback = () => {
    const callback = afterSubmitCallback.current;
    if (!callback) {
      return;
    }
    // The callback runs after the submit itself has finished (and after
    // SubmitButton's success feedback), so it needs its own permission to close
    // the Modal.
    runWithGrantedModalClose(modalController, callback);
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
    </RhfFormContextProvider>
  );
}

export default Form;
