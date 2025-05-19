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
import Button from "@/components/Button";
import { Action, type ActionFn } from "@/components/Action";
import FieldLabel from "@/components/PasswordCreationField/components/FieldLabel/FieldLabel";
import { IconHide, IconShow } from "@/components/Icon/components/icons";
import getStatusTextFromPolicyValidationResult from "@/components/PasswordCreationField/lib/getStatusTextFromPolicyValidationResult";
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
import { PromiseQueue } from "@/components/PasswordCreationField/lib/promiseQueue";
import { useGeneratePassword } from "@/components/PasswordCreationField/worker/useGeneratePassword";

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

    const translate = useLocalizedStringFormatter(locales);
    const promiseQueue = useRef(new PromiseQueue({ autoStart: true })).current;

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

    const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const generatePassword = useGeneratePassword(validationPolicy);

    const initialRuleResult = useRef<RuleValidationResult[] | undefined>(
      undefined,
    );
    const initialValidationState: ResolvedPolicyValidationResult = {
      isEmptyValueValidation: true,
      isValid: false,
      complexity: {
        min: validationPolicy.minComplexity,
        actual: 4,
        warning: null,
      },
      ruleResults: initialRuleResult.current ?? [],
    };

    const [policyValidationResult, setPolicyValidationResult] = useState(
      initialValidationState,
    );

    const statusTextFromValidationResult =
      getStatusTextFromPolicyValidationResult(policyValidationResult);
    let translatedStatusText = undefined;
    if (statusTextFromValidationResult) {
      const [translationKey, translationValues] = generateValidationTranslation(
        statusTextFromValidationResult,
      );
      translatedStatusText = translate.format(
        translationKey,
        translationValues,
      );
    }

    const isInvalid =
      invalidFromProps ||
      (!policyValidationResult?.isEmptyValueValidation &&
        !statusTextFromValidationResult?.isValid);

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
            if (!initialRuleResult.current) {
              initialRuleResult.current = ruleResults;
            }
            setPolicyValidationResult({
              // on empty values assume the state as valid but keep the single rule validations
              // to show the result in the info box without showing a complete failed validation
              ...initialValidationState,
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
      setPolicyValidationResult((old) => ({
        isEmptyValueValidation: false,
        ruleResults: old?.ruleResults ?? [],
        isValid: true,
        complexity: {
          warning: null,
          min: validationPolicy.minComplexity,
          actual: 4 as ComplexityScore,
        },
      }));
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
        className: dynamic((p) => clsx(p.className, styles.button)),
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
          if (translatedStatusText) {
            return translatedStatusText;
          }
        }),
      },
    };

    const customButtonContext: PropsContext = {
      Button: propsContext.Button,
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
                <PropsContextProvider props={customButtonContext}>
                  <Action action={togglePasswordVisibilityHandler}>
                    <Button data-component="toggleRevealPassword" slot="button">
                      {!isPasswordRevealed ? <IconShow /> : <IconHide />}
                    </Button>
                  </Action>
                  <TunnelExit id="button" />
                </PropsContextProvider>
              </Aria.Group>
              <ComplexityIndicator
                isLoading={isLoading}
                policyValidationResult={policyValidationResult}
              />
            </Aria.Group>
            <PropsContextProvider props={propsContext}>
              {!policyValidationResult?.isEmptyValueValidation &&
                statusTextFromValidationResult?.isValid && (
                  <FieldDescription>{translatedStatusText}</FieldDescription>
                )}
              {!policyValidationResult?.isEmptyValueValidation &&
                !statusTextFromValidationResult?.isValid && <FieldError />}
              {children}
            </PropsContextProvider>
          </Aria.TextField>
        </TunnelProvider>
      </ClearPropsContext>
    );
  },
);

export default PasswordCreationField;
