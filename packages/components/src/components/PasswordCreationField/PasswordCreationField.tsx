import {
  type PropsWithChildren,
  useState,
  type ClipboardEvent,
  useDeferredValue,
  useMemo,
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
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import { type ActionFn } from "@/components/Action";
import getStateFromLatestPolicyValidationResult from "@/components/PasswordCreationField/lib/getStateFromLatestPolicyValidationResult";
import locales from "./locales/*.locale.json";
import generateValidationTranslation from "@/components/PasswordCreationField/lib/generateValidationTranslation";
import FieldDescription from "@/components/FieldDescription";
import ComplexityIndicator from "@/components/PasswordCreationField/components/ComplexityIndicator/ComplexityIndicator";
import { generatePassword } from "@/components/PasswordCreationField/worker/generatePassword";
import TogglePasswordVisibilityButton from "@/components/PasswordCreationField/components/TogglePasswordVisibilityButton/TogglePasswordVisibilityButton";
import { FieldErrorContext } from "react-aria-components";
import { Wrap } from "@/components/Wrap";
import { ReactAriaControlledValueFix } from "@/lib/react/ReactAriaControlledValueFix";
import { ValidationResultButton } from "@/components/PasswordCreationField/components/ValidationResultButton/ValidationResultButton";
import { PasswordGenerateButton } from "@/components/PasswordCreationField/components/PasswordGenerateButton/PasswordGenerateButton";
import { useLocalizedContextStringFormatter } from "@/components/TranslationProvider/useLocalizedContextStringFormatter";
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
import { useManagedValue } from "@/lib/hooks/useManagedValue";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";

export interface PasswordCreationFieldProps
  extends PropsWithChildren<
      Omit<Aria.TextFieldProps, "children" | "value" | "defaultValue"> &
        Partial<Pick<Aria.FieldErrorRenderProps, "validationErrors">>
    >,
    FlowComponentProps<HTMLInputElement> {
  value?: string;
  onValidationResult?: (result: { password: string; isValid: boolean }) => void;
  defaultValue?: string;
  placeholder?: string;
  validationPolicy?: PolicyGenericDeclaration;
}

export interface ResolvedPolicyValidationResult
  extends Omit<PolicyValidationResult, "isValid"> {
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
      ...rest
    } = props;

    const {
      FieldErrorView,
      FieldErrorResetContext,
      fieldProps,
      fieldPropsContext,
    } = useFieldComponent(props);

    const [isLoading, setIsLoading] = useState(false);
    const translate = useLocalizedContextStringFormatter(locales);

    const validationPolicy = useMemo(
      () => Policy.fromDeclaration(validationPolicyFromProps),
      [validationPolicyFromProps],
    );

    const { value, handleOnChange } = useManagedValue(props);
    const deferredValue = useDeferredValue(value);

    const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);
    const initialPolicyValidationState: ResolvedPolicyValidationResult = {
      isValid: true,
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
    usePolicyValidationResult(
      validationPolicy,
      deferredValue,
      () => {
        if (isEmptyValue) {
          return;
        }

        setIsLoading(() => true);
      },
      ({ password, isValid, results }) => {
        if (isEmptyValue) {
          setPolicyValidationResult(() => ({
            ...results,
            isValid: true,
          }));
          return;
        }

        setIsLoading(() => false);
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
      !isEmptyValue && !stateFromValidationResult?.isValid;
    const isInvalid = invalidFromProps || isInvalidFromValidationResult;

    const setOptimisticPolicyValidationResult = (
      state: Partial<ResolvedPolicyValidationResult> = {},
    ) => {
      setIsLoading(() => false);
      setPolicyValidationResult(() => ({
        ...initialPolicyValidationState,
        ...state,
        isValid: true,
      }));
    };

    const onPasswordGenerateHandler: ActionFn = async () => {
      const generatedPassword = await generatePassword(validationPolicy);
      setOptimisticPolicyValidationResult();
      setIsPasswordRevealed(true);
      handleOnChange(generatedPassword);
    };

    const onPasswordPasteHandler = (event: ClipboardEvent) => {
      const pastedValue = event.clipboardData.getData("text");
      if (pastedValue !== value) {
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
        tunnelId: "button",
        size: "m",
        variant: "plain",
        color: "secondary",
        isDisabled: isDisabled,
        className: styles.button,
      },
      CopyButton: {
        tunnelId: "button",
        size: "m",
        variant: "plain",
        color: "secondary",
        isDisabled: isDisabled,
        className: styles.button,
        text: value,
      },
      Label: {
        ...fieldPropsContext.Label,
        tunnelId: "label",
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
        value={value}
        type={isPasswordRevealed ? "text" : "password"}
        onChange={handleOnChange}
        onPaste={onPasswordPasteHandler}
        className={clsx(className, fieldProps.className)}
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        isRequired={isRequired}
      >
        <TunnelProvider>
          <FieldErrorResetContext>
            <PropsContextProvider
              props={propsContext}
              dependencies={[
                isDisabled,
                isRequired,
                value,
                policyValidationResult,
              ]}
            >
              <TunnelExit id="label" />
              <Aria.Group
                isDisabled={isDisabled}
                className={clsx(styles.inputGroup)}
              >
                <ReactAriaControlledValueFix
                  inputContext={Aria.InputContext}
                  props={{ ...props, value }}
                >
                  <Aria.Input ref={ref} className={styles.input} />
                </ReactAriaControlledValueFix>
                <Aria.Group className={styles.buttonContainer}>
                  <TogglePasswordVisibilityButton
                    className={styles.button}
                    isVisible={isPasswordRevealed}
                    isDisabled={isDisabled}
                    onPress={togglePasswordVisibilityHandler}
                  />
                  <TunnelExit id="button" />
                </Aria.Group>
                <ComplexityIndicator
                  isEmptyValue={isEmptyValue}
                  isLoading={isLoading}
                  policyValidationResult={policyValidationResult}
                  validationResultState={stateFromValidationResult}
                />
              </Aria.Group>
              {children}
              {isValidFromValidationResult && (
                <FieldDescription>{latestValidationErrorText}</FieldDescription>
              )}
            </PropsContextProvider>
          </FieldErrorResetContext>
          <Wrap
            if={
              isInvalidFromValidationResult &&
              policyValidationResult.isValid !== "indeterminate" &&
              latestValidationErrorText
            }
          >
            <FieldErrorContext.Provider
              value={{
                isInvalid: true,
                validationErrors: [latestValidationErrorText ?? ""],
                validationDetails: {
                  customError: true,
                  valid: false,
                  typeMismatch: false,
                  stepMismatch: false,
                  valueMissing: false,
                  tooShort: false,
                  tooLong: false,
                  rangeUnderflow: false,
                  patternMismatch: false,
                  badInput: false,
                  rangeOverflow: false,
                },
              }}
            >
              <FieldErrorView />
            </FieldErrorContext.Provider>
          </Wrap>
        </TunnelProvider>
      </Aria.TextField>
    );
  },
);

export default PasswordCreationField;
