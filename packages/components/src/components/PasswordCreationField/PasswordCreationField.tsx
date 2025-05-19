import React, {
  type PropsWithChildren,
  useEffect,
  useState,
  useRef,
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
import type { ComplexityScore } from "@mittwald/password-tools-js/policy";
import { Policy } from "@mittwald/password-tools-js/policy";
import { type ActionFn } from "@/components/Action";
import FieldLabel from "@/components/PasswordCreationField/components/FieldLabel/FieldLabel";
import getStateFromLatestPolicyValidationResult from "@/components/PasswordCreationField/lib/getStateFromLatestPolicyValidationResult";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import generateValidationTranslation from "@/components/PasswordCreationField/lib/generateValidationTranslation";
import { RuleType } from "@mittwald/password-tools-js/rules";
import { FieldError } from "@/components/FieldError";
import FieldDescription from "@/components/FieldDescription";
import ComplexityIndicator from "@/components/PasswordCreationField/components/ComplexityIndicator/ComplexityIndicator";
import { type PolicyValidationResult } from "@mittwald/password-tools-js/policy";
import { type RuleValidationResult } from "@mittwald/password-tools-js/rules";
import { useDebounceValue } from "usehooks-ts";
import { usePromiseQueue } from "@/components/PasswordCreationField/lib/promiseQueue";
import { useGeneratePassword } from "@/components/PasswordCreationField/worker/useGeneratePassword";
import TogglePasswordVisibilityButton from "@/components/PasswordCreationField/components/TogglePasswordVisibilityButton/TogglePasswordVisibilityButton";

const validationDebounceMilliseconds = 200;

export const defaultPasswordCreationPolicy = Policy.fromDeclaration({
  minComplexity: 3,
  rules: [
    {
      ruleType: RuleType.length,
      min: 12,
    },
    {
      ruleType: RuleType.hibp,
    },
    {
      identifier: "special",
      ruleType: RuleType.charPool,
      charPools: ["special"],
    },
    {
      identifier: "numbers",
      ruleType: RuleType.charPool,
      charPools: ["numbers"],
    },
  ],
});

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

export interface ResolvedPolicyValidationResult extends PolicyValidationResult {
  isEmptyValueValidation: boolean;
  isValid: boolean;
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

    const promiseQueue = usePromiseQueue();
    const translate = useLocalizedStringFormatter(locales);
    const generatePassword = useGeneratePassword(validationPolicy);

    const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const initialPolicyValidationState: ResolvedPolicyValidationResult = {
      isEmptyValueValidation: true,
      isValid: false,
      complexity: {
        min: validationPolicy.minComplexity,
        actual: 4 as ComplexityScore,
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
    const [uncontrolledValue, setUncontrolledValueRaw] = useState(
      defaultValue ?? "",
    );
    const value =
      valueControlType === "controlled" ? valueFromProps : uncontrolledValue;
    const [bouncedValue, setDebouncedValue] = useDebounceValue(
      value ?? "",
      validationDebounceMilliseconds,
    );
    const setUncontrolledValue = (value: string) => {
      setUncontrolledValueRaw(value);
      setDebouncedValue(value);
    };

    useEffect(() => {
      setIsLoading(true);
      void promiseQueue
        .add(async () => {
          const validationResult = validationPolicy.validate(bouncedValue);
          return Promise.all([
            Promise.resolve(bouncedValue),
            validationResult.isValid,
            validationResult.complexity,
            ...validationResult.ruleResults,
          ]);
        })
        .then(([validatedValue, isValid, complexity, ...ruleResults]) => {
          setIsLoading(false);

          if (!validatedValue) {
            setPolicyValidationResult({
              // on empty values assume the state as valid but keep the single rule validations
              // to show the result in the info box without showing a complete failed validation
              ...initialPolicyValidationState,
              ruleResults,
            });
            return;
          }

          setPolicyValidationResult({
            isEmptyValueValidation: false,
            isValid,
            complexity,
            ruleResults,
          });
        });
    }, [bouncedValue, validationPolicy]);

    const setOptimisticPolicyValidationResult = () => {
      setPolicyValidationResult({
        ...initialPolicyValidationState,
        isEmptyValueValidation: false,
        isValid: true,
      });
    };

    const onChangeValueHandler = (value: string) => {
      if (onChange) {
        onChange(value);
      }
      if (valueControlType === "uncontrolled") {
        setUncontrolledValue(value);
      }
    };

    const onPasswordGenerateHandler: ActionFn = async () => {
      const generatedPassword = await generatePassword();
      setOptimisticPolicyValidationResult();
      setIsPasswordRevealed(true);
      onChangeValueHandler(generatedPassword);
    };

    const onPasswordInputChangeHandler = (value: string) => {
      onChangeValueHandler(value);
    };

    const onPasswordPasteHandler = () => {
      setOptimisticPolicyValidationResult();
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
          <FieldLabel
            disabled={isDisabled}
            onGeneratePasswordAction={onPasswordGenerateHandler}
            policyValidationResult={policyValidationResult}
          />
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
              {isInvalidFromValidationResult && <FieldError />}
              {children}
            </PropsContextProvider>
          </Aria.TextField>
        </TunnelProvider>
      </ClearPropsContext>
    );
  },
);

export default PasswordCreationField;
