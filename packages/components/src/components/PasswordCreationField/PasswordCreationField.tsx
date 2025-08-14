import React, {
  type PropsWithChildren,
  useState,
  type ClipboardEvent,
  useDeferredValue,
  useMemo,
} from "react";
import {
  ClearPropsContext,
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
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import clsx from "clsx";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import { type ActionFn } from "@/components/Action";
import getStateFromLatestPolicyValidationResult from "@/components/PasswordCreationField/lib/getStateFromLatestPolicyValidationResult";
import locales from "./locales/*.locale.json";
import generateValidationTranslation from "@/components/PasswordCreationField/lib/generateValidationTranslation";
import { FieldError } from "@/components/FieldError";
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
  defaultPasswordCreationPolicy,
} from "@/integrations/@mittwald/password-tools-js";
import { Policy } from "@/integrations/@mittwald/password-tools-js";
import { usePolicyValidationResult } from "@/components/PasswordCreationField/lib/usePolicyValidationResult";

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

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const PasswordCreationField = flowComponent(
  "PasswordCreationField",
  (props) => {
    const {
      children,
      className,
      ref,
      isDisabled,
      onChange: onChangeFromProps,
      onValidationResult,
      isInvalid: invalidFromProps,
      validationPolicy:
        validationPolicyFromProps = defaultPasswordCreationPolicy,
      isRequired,
      value: valueFromProps,
      defaultValue,
      ...rest
    } = props;

    const [isLoading, setIsLoading] = useState(false);
    const translate = useLocalizedContextStringFormatter(locales);
    const validationPolicy = useMemo(
      () => Policy.fromDeclaration(validationPolicyFromProps),
      [validationPolicyFromProps],
    );

    const isControlled = typeof valueFromProps !== "undefined";
    const hasDefaultValue = typeof defaultValue !== "undefined";
    const [internalValue, setInternalValue] = useState(
      hasDefaultValue ? defaultValue : "",
    );
    const value = isControlled ? valueFromProps : internalValue;
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

    const onChangeHandler = (value: string) => {
      if (onChangeFromProps) {
        onChangeFromProps(value);
      }

      if (!isControlled) {
        setInternalValue(() => value);
      }
    };

    const onPasswordGenerateHandler: ActionFn = async () => {
      const generatedPassword = await generatePassword(validationPolicy);
      setOptimisticPolicyValidationResult();
      setIsPasswordRevealed(true);
      onChangeHandler(generatedPassword);
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
        className: formFieldStyles.label,
        tunnelId: "label",
        optional: !isRequired,
        isDisabled: isDisabled,
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
      FieldDescription: {
        className: formFieldStyles.fieldDescription,
      },
      FieldError: {
        className: formFieldStyles.customFieldError,
        children: dynamic(() => {
          if (latestValidationErrorText) {
            return latestValidationErrorText;
          }
        }),
      },
    };

    return (
      <ClearPropsContext>
        <TunnelProvider>
          <Aria.TextField
            {...rest}
            value={value}
            type={isPasswordRevealed ? "text" : "password"}
            onChange={onChangeHandler}
            onPaste={onPasswordPasteHandler}
            className={clsx(className, formFieldStyles.formField)}
            isDisabled={isDisabled}
            isInvalid={isInvalid}
            isRequired={isRequired}
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
            <PropsContextProvider props={propsContext}>
              {isValidFromValidationResult && (
                <FieldDescription>{latestValidationErrorText}</FieldDescription>
              )}
              {isInvalidFromValidationResult &&
                policyValidationResult.isValid !== "indeterminate" && (
                  <FieldError>{latestValidationErrorText}</FieldError>
                )}
              <Wrap if={isInvalidFromValidationResult}>
                <FieldErrorContext.Provider
                  value={{
                    isInvalid: false,
                    validationErrors: [],
                    validationDetails: {
                      customError: false,
                      valid: true,
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
                  {children}
                </FieldErrorContext.Provider>
              </Wrap>
            </PropsContextProvider>
          </Aria.TextField>
        </TunnelProvider>
      </ClearPropsContext>
    );
  },
);

export default PasswordCreationField;
