import {
  type PropsWithChildren,
  useState,
  type ClipboardEvent,
  useCallback,
  useId,
  useMemo,
  useRef,
} from "react";
import {
  dynamic,
  type PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import styles from "./PasswordCreationField.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { type ActionFn } from "@/components/Action";
import getStateFromLatestPolicyValidationResult from "@/components/PasswordCreationField/lib/getStateFromLatestPolicyValidationResult";
import locales from "./locales/*.locale.json";
import generateValidationTranslation from "@/components/PasswordCreationField/lib/generateValidationTranslation";
import FieldDescription from "@/components/FieldDescription";
import ComplexityIndicator from "@/components/PasswordCreationField/components/ComplexityIndicator/ComplexityIndicator";
import { generatePassword } from "@/components/PasswordCreationField/worker/generatePassword";
import TogglePasswordVisibilityButton from "@/components/PasswordCreationField/components/TogglePasswordVisibilityButton/TogglePasswordVisibilityButton";
import { ValidationResultButton } from "@/components/PasswordCreationField/components/ValidationResultButton/ValidationResultButton";
import { PasswordGenerateButton } from "@/components/PasswordCreationField/components/PasswordGenerateButton/PasswordGenerateButton";
import type {
  PolicyValidationResult,
  PolicyGenericDeclaration,
  RuleValidationResult,
} from "@/integrations/@mittwald/password-tools-js";
import {
  defaultPasswordCreationPolicy,
  Policy,
} from "@/integrations/@mittwald/password-tools-js";
import { usePolicyValidationResult } from "@/components/PasswordCreationField/lib/usePolicyValidationResult";
import { joinIds, useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { FieldError } from "@/components/FieldError";
import { useControlledHostValueProps } from "@/lib/remote/useControlledHostValueProps";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";
import {
  useAriaAnnouncePasswordVisibility,
  useAriaAnnounceValidationState,
} from "@/components/PasswordCreationField/lib/ariaAnnounce";

export interface PasswordCreationFieldProps
  extends
    PropsWithChildren<
      Omit<Aria.TextFieldProps, "children" | "value" | "defaultValue"> &
        Partial<Pick<Aria.FieldErrorRenderProps, "validationErrors">>
    >,
    FlowComponentProps<HTMLInputElement> {
  /** The password of a controlled field. */
  value?: string;
  /** Called with the password and its validity whenever the password changes. */
  onValidationResult?: (result: { password: string; isValid: boolean }) => void;
  /** The initial password of an uncontrolled field. */
  defaultValue?: string;
  /** The placeholder shown while the field is empty. */
  placeholder?: string;
  /**
   * The policy the password is validated against.
   *
   * @default defaultPasswordCreationPolicy
   */
  validationPolicy?: PolicyGenericDeclaration;
}

export interface ResolvedPolicyValidationResult extends Omit<
  PolicyValidationResult,
  "isValid"
> {
  isValid: boolean | "indeterminate";
  ruleResults: RuleValidationResult[];
}

/** @flr-generate all */
export const PasswordCreationField = flowComponent(
  "PasswordCreationField",
  (props) => {
    const {
      children,
      className,
      ref,
      isDisabled,
      onValidationResult,
      isInvalid: invalidFromProps,
      validationPolicy:
        validationPolicyFromProps = defaultPasswordCreationPolicy,
      isRequired,
      value,
      onChange,
      ...rest
    } = useControlledHostValueProps(props, "");

    const translate = useLocalizedStringFormatter(
      locales,
      "PasswordCreationField",
    );

    const validationPolicy = useMemo(
      () => Policy.fromDeclaration(validationPolicyFromProps),
      [validationPolicyFromProps],
    );

    const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);
    const initialPolicyValidationState: ResolvedPolicyValidationResult = {
      isValid: "indeterminate",
      complexity: {
        min: validationPolicy.minComplexity,
        actual: 4,
        warning: null,
      },
      ruleResults: [],
    };

    const [policyValidationResult, setPolicyValidationResult] = useState(
      initialPolicyValidationState,
    );

    const loadingRef = useRef<ReturnType<typeof setTimeout>>(null);
    const { rememberValidationResult } = usePolicyValidationResult(
      validationPolicy,
      value ?? "",
      () => {
        if (isEmptyValue) {
          return;
        }

        loadingRef.current = setTimeout(() => {
          setPolicyValidationResult((r) => ({
            ...r,
            isValid: "indeterminate",
          }));
        }, 150);
      },
      ({ password, isValid, results }) => {
        if (loadingRef.current) {
          clearTimeout(loadingRef.current);
        }

        if (isEmptyValue) {
          setPolicyValidationResult(() => ({
            ...results,
            isValid: true,
          }));
          return;
        }

        setPolicyValidationResult(() => results);
        onValidationResult?.({ password, isValid });
      },
    );

    const isEmptyValue = !value;
    const stateFromValidationResult = getStateFromLatestPolicyValidationResult(
      isEmptyValue,
      policyValidationResult,
    );
    let latestValidationErrorText = undefined;
    if (stateFromValidationResult) {
      const [translationKey, translationValues] = generateValidationTranslation(
        stateFromValidationResult,
      );
      latestValidationErrorText = translate.format(
        translationKey,
        translationValues,
      );
    }

    const isValidFromValidationResult =
      !isEmptyValue && stateFromValidationResult?.isValid;

    const isInvalidFromValidationResult =
      !isEmptyValue && stateFromValidationResult?.isValid === false;
    const isInvalid = invalidFromProps || isInvalidFromValidationResult;

    const {
      FieldErrorView,
      FieldErrorCaptureContext,
      wrapperProps,
      controlProps,
      fieldPropsContext,
      renderedFieldErrorId,
    } = useFieldComponent(props, "PasswordCreationField");

    /**
     * The result for a valid password appears after the asynchronous policy
     * validation. react-aria resolves its description slot only when the
     * field's validity changes, so a result that appears while the field stays
     * valid (a generated password) was never linked. It gets its own id
     * instead, referenced only while it is rendered.
     *
     * A shown error replaces it: the FormField styles hide descriptions next to
     * an error, and a hidden description would still be announced.
     */
    const resultDescriptionId = useId();
    const [isResultDescriptionRendered, setIsResultDescriptionRendered] =
      useState(false);
    const resultDescriptionRef = useCallback((element: Element | null) => {
      setIsResultDescriptionRendered(!!element);
    }, []);
    const describedBy = joinIds(
      isResultDescriptionRendered && resultDescriptionId,
      controlProps["aria-describedby"],
    );

    useAriaAnnounceValidationState(
      latestValidationErrorText,
      !isEmptyValue && policyValidationResult.isValid !== "indeterminate",
    );
    useAriaAnnouncePasswordVisibility(isPasswordRevealed);

    const setOptimisticPolicyValidationResult = (
      state: Partial<ResolvedPolicyValidationResult> = {},
    ) => {
      setPolicyValidationResult((currentState) => ({
        ...currentState,
        isValid: true,
        ...state,
      }));
    };

    const onPasswordGenerateHandler: ActionFn = async () => {
      const generatedPassword = await generatePassword(validationPolicy);
      /**
       * The generator returns only passwords the policy accepts, so the rating
       * is set with the password instead of after the typing debounce. It is
       * the policy's own result: a guessed one (full strength) was overturned
       * by the real rating, e.g. to "meets the minimum requirements". Cached,
       * so the debounced validation of this password does not rate it again.
       */
      const generatedPasswordResult =
        await validationPolicy.validate(generatedPassword);
      rememberValidationResult(generatedPassword, generatedPasswordResult);
      setPolicyValidationResult(generatedPasswordResult);
      setIsPasswordRevealed(true);
      onChange(generatedPassword);
    };

    const onPasswordPasteHandler = (event: ClipboardEvent) => {
      const pastedValue = event.clipboardData?.getData("text");
      if (typeof pastedValue === "string" && pastedValue !== value) {
        setOptimisticPolicyValidationResult({
          isValid: "indeterminate",
        });
      }
    };

    const togglePasswordVisibilityHandler = () => {
      setIsPasswordRevealed((old) => !old);
    };

    const propsContext: PropsContext = {
      ...fieldPropsContext,
      Button: {
        tunnel: {
          id: "button",
          component: "PasswordCreationField",
        },
        size: "m",
        variant: "plain",
        color: "secondary",
        isDisabled: isDisabled,
        className: styles.button,
      },
      CopyButton: {
        tunnel: {
          id: "button",
          component: "PasswordCreationField",
        },
        size: "m",
        variant: "plain",
        color: "secondary",
        isDisabled: isDisabled,
        className: styles.button,
        text: value,
      },
      Label: {
        ...fieldPropsContext.Label,
        children: dynamic((localProps) => {
          return (
            <>
              {localProps.children}
              <PasswordGenerateButton
                isDisabled={isDisabled}
                onGeneratePasswordAction={onPasswordGenerateHandler}
              />
              <ValidationResultButton
                isEmptyValue={isEmptyValue}
                isDisabled={isDisabled}
                policyValidationResult={policyValidationResult}
              />
            </>
          );
        }),
      },
    };

    return (
      <Aria.TextField
        {...rest}
        aria-describedby={describedBy}
        value={value}
        type={isPasswordRevealed ? "text" : "password"}
        onChange={onChange}
        onPaste={onPasswordPasteHandler}
        className={clsx(className, wrapperProps.className)}
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        isRequired={isRequired}
      >
        <FieldErrorCaptureContext>
          {latestValidationErrorText && (
            <FieldError>{latestValidationErrorText}</FieldError>
          )}
          <PropsContextProvider
            props={propsContext}
            dependencies={[
              isDisabled,
              isRequired,
              value,
              policyValidationResult,
              isEmptyValue,
            ]}
          >
            {children}
            <Aria.Group
              isDisabled={isDisabled}
              className={clsx(styles.inputGroup)}
            >
              <Aria.Input ref={ref} className={styles.input} />
              <Aria.Group className={styles.buttonContainer}>
                <TogglePasswordVisibilityButton
                  className={styles.button}
                  isVisible={isPasswordRevealed}
                  isDisabled={isDisabled}
                  onPress={togglePasswordVisibilityHandler}
                />
                <UiComponentTunnelExit
                  id="button"
                  component="PasswordCreationField"
                />
              </Aria.Group>
              <ComplexityIndicator
                key={value}
                isEmptyValue={isEmptyValue}
                isLoading={policyValidationResult.isValid === "indeterminate"}
                policyValidationResult={policyValidationResult}
                validationResultState={stateFromValidationResult}
                isInvalid={invalidFromProps}
              />
            </Aria.Group>
            {isValidFromValidationResult && !renderedFieldErrorId && (
              // Out of react-aria's description slot, which would set its own
              // id – see `resultDescriptionId`.
              <Aria.TextContext.Provider value={null}>
                <FieldDescription
                  id={resultDescriptionId}
                  ref={resultDescriptionRef}
                >
                  {latestValidationErrorText}
                </FieldDescription>
              </Aria.TextContext.Provider>
            )}
          </PropsContextProvider>
        </FieldErrorCaptureContext>
        <FieldErrorView />
      </Aria.TextField>
    );
  },
);

export default PasswordCreationField;
