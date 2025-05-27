import React, {
  type PropsWithChildren,
  useState,
  useRef,
  type ClipboardEvent,
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
import type { Policy } from "@mittwald/password-tools-js/policy";
import { type ActionFn } from "@/components/Action";
import FieldLabel from "@/components/PasswordCreationField/components/FieldLabel/FieldLabel";
import getStateFromLatestPolicyValidationResult from "@/components/PasswordCreationField/lib/getStateFromLatestPolicyValidationResult";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import generateValidationTranslation from "@/components/PasswordCreationField/lib/generateValidationTranslation";
import { FieldError } from "@/components/FieldError";
import FieldDescription from "@/components/FieldDescription";
import ComplexityIndicator from "@/components/PasswordCreationField/components/ComplexityIndicator/ComplexityIndicator";
import { type PolicyValidationResult } from "@mittwald/password-tools-js/policy";
import { type RuleValidationResult } from "@mittwald/password-tools-js/rules";
import { useDebounceValue } from "usehooks-ts";
import { generatePassword } from "@/components/PasswordCreationField/worker/generatePassword";
import TogglePasswordVisibilityButton from "@/components/PasswordCreationField/components/TogglePasswordVisibilityButton/TogglePasswordVisibilityButton";
import { useAbortablePromise } from "@/lib/promises/useAbortablePromise";
import { defaultPasswordCreationPolicy } from "@/components/PasswordCreationField/defaultPasswordCreationPolicy";
import { FieldErrorContext } from "react-aria-components";
import { Wrap } from "@/components/Wrap";

const validationDebounceMilliseconds = 200;

export interface PasswordCreationFieldProps
  extends PropsWithChildren<
      Omit<Aria.TextFieldProps, "children" | "value" | "defaultValue"> &
        Partial<Pick<Aria.FieldErrorRenderProps, "validationErrors">>
    >,
    FlowComponentProps<HTMLInputElement> {
  value?: string;
  defaultValue?: string;
  validationPolicy?: Policy;
}

export interface ResolvedPolicyValidationResult
  extends Omit<PolicyValidationResult, "isValid"> {
  isEmptyValueValidation: boolean;
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
      value: valueFromProps,
      defaultValue,
      className,
      ref,
      isDisabled,
      onChange,
      isInvalid: invalidFromProps,
      validationPolicy = defaultPasswordCreationPolicy,
      isRequired,
      ...rest
    } = props;

    const translate = useLocalizedStringFormatter(locales);

    const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const initialPolicyValidationState: ResolvedPolicyValidationResult = {
      isEmptyValueValidation: true,
      isValid: false,
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

    const stateFromValidationResult = getStateFromLatestPolicyValidationResult(
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
      !policyValidationResult.isEmptyValueValidation &&
      stateFromValidationResult?.isValid;

    const isInvalidFromValidationResult =
      !policyValidationResult.isEmptyValueValidation &&
      !stateFromValidationResult?.isValid;

    const isInvalid = invalidFromProps || isInvalidFromValidationResult;

    const valueControlType = useRef<"controlled" | "uncontrolled">(
      valueFromProps === undefined ? "uncontrolled" : "controlled",
    ).current;

    const [value, setValue] = useState(
      (valueControlType === "controlled" ? valueFromProps : defaultValue) ?? "",
    );

    const [bouncedValue, setDebouncedValue] = useDebounceValue(
      value,
      validationDebounceMilliseconds,
    );

    const setUncontrolledValue = (value: string) => {
      setValue(value);
      setDebouncedValue(value);
    };

    const setOptimisticPolicyValidationResult = (
      isValid: ResolvedPolicyValidationResult["isValid"] = true,
    ) => {
      setPolicyValidationResult({
        ...initialPolicyValidationState,
        isEmptyValueValidation: false,
        isValid,
      });
    };

    const emmitChange = (value: string, result: PolicyValidationResult) => {
      if (!policyValidationResult.isEmptyValueValidation && onChange) {
        onChange(result.isValid ? value : "");
      }
    };

    useAbortablePromise(
      async (signal) => {
        const validationResult = validationPolicy.validate(bouncedValue);
        if (typeof validationResult.isValid === "boolean") {
          setIsLoading(false);
          setPolicyValidationResult((old) => ({
            ...old,
            isEmptyValueValidation: bouncedValue === "",
            isValid: validationResult.isValid as boolean,
            ruleResults: validationResult.ruleResults as RuleValidationResult[],
            complexity: validationResult.complexity,
          }));
          emmitChange(bouncedValue, validationResult);
        } else {
          const nonPromiseValidationsInvalid = validationResult.ruleResults
            .filter((r): r is RuleValidationResult => !(r instanceof Promise))
            .some((r) => !r.isValid);

          if (!policyValidationResult.isEmptyValueValidation) {
            setIsLoading(true);
          }
          if (!nonPromiseValidationsInvalid) {
            setOptimisticPolicyValidationResult();
          }

          void Promise.all([
            Promise.resolve(bouncedValue),
            ...validationResult.ruleResults,
          ]).then(([value, ...validationResults]) => {
            if (signal.aborted) {
              return;
            }

            const isValid = !validationResults.some((r) => !r.isValid);

            setIsLoading(false);
            setPolicyValidationResult((old) => ({
              ...old,
              isEmptyValueValidation: value === "",
              isValid,
              ruleResults: validationResults,
            }));

            emmitChange(value, validationResult);
          });
        }
      },
      [bouncedValue, validationPolicy],
    );

    const onChangeValueHandler = (value: string) => {
      setUncontrolledValue(value);
    };

    const onPasswordGenerateHandler: ActionFn = async () => {
      const generatedPassword = await generatePassword(validationPolicy);
      setOptimisticPolicyValidationResult();
      setIsPasswordRevealed(true);
      onChangeValueHandler(generatedPassword);
    };

    const onPasswordInputChangeHandler = (value: string) => {
      onChangeValueHandler(value);
    };

    const onPasswordPasteHandler = (event: ClipboardEvent) => {
      const pastedValue = event.clipboardData.getData("text");
      if (pastedValue !== bouncedValue) {
        setOptimisticPolicyValidationResult("indeterminate");
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
      },
      Label: {
        className: formFieldStyles.label,
        tunnelId: "label",
        optional: !isRequired,
        isDisabled: isDisabled,
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
            type={isPasswordRevealed ? "text" : "password"}
            value={value}
            onChange={onPasswordInputChangeHandler}
            onPaste={onPasswordPasteHandler}
            className={clsx(className, formFieldStyles.formField)}
            isDisabled={isDisabled}
            isInvalid={isInvalid}
            isRequired={isRequired}
            {...rest}
          >
            <FieldLabel
              disabled={isDisabled}
              onGeneratePasswordAction={onPasswordGenerateHandler}
              policyValidationResult={policyValidationResult}
            />
            <Aria.Group
              isDisabled={isDisabled}
              className={clsx(styles.inputGroup)}
            >
              <Aria.Input className={styles.input} ref={ref} value={value} />
              <Aria.Group className={styles.buttonContainer}>
                <TogglePasswordVisibilityButton
                  isVisible={isPasswordRevealed}
                  isDisabled={isDisabled}
                  onPress={togglePasswordVisibilityHandler}
                />
                <TunnelExit id="button" />
              </Aria.Group>
              <ComplexityIndicator
                isLoading={isLoading}
                policyValidationResult={policyValidationResult}
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
