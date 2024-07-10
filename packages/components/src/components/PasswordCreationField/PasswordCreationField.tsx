import { useDeferredValue } from "react";
import { useRef } from "react";
import React, {
  type PropsWithChildren,
  startTransition,
  useEffect,
  useState,
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
import { Policy } from "@mittwald/password-tools-js/policy";
import { Generator } from "@mittwald/password-tools-js/generator";
import Button from "@/components/Button";
import { Action, type ActionFn } from "@/components/Action";
import FieldLabel from "@/components/PasswordCreationField/components/FieldLabel/FieldLabel";
import { IconHide, IconShow } from "@/components/Icon/components/icons";
import { type ResolvedPolicyValidationResult } from "@/components/PasswordCreationField/lib/getStatusFromPolicyValidationResult";
import getStatusTextFromPolicyValidationResult from "@/components/PasswordCreationField/lib/getStatusTextFromPolicyValidationResult";
import locales from "./locales/*.locale.json";
import type { LocalizedStrings } from "react-aria";
import { useLocalizedStringFormatter } from "react-aria";
import generateValidationTranslation from "@/components/PasswordCreationField/lib/generateValidationTranslation";
import { RuleType } from "@mittwald/password-tools-js/rules";
import { FieldError } from "@/components/FieldError";
import FieldDescription from "@/components/FieldDescription";
import PromiseQueue from "p-queue";
import ComplexityIndicator from "@/components/PasswordCreationField/components/ComplexityIndicator/ComplexityIndicator";

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
      identifier: "specialChars",
      ruleType: RuleType.charPool,
      charPools: ["special"],
    },
    {
      identifier: "numberChars",
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
    FlowComponentProps {
  locales?: LocalizedStrings;
  value?: string;
  defaultValue?: string;
  validationPolicy?: Policy;
}

export interface PolicyValidationResult extends ResolvedPolicyValidationResult {
  isEmptyValueValidation: boolean;
}

export const PasswordCreationField = flowComponent(
  "PasswordCreationField",
  (props) => {
    const {
      children,
      value: valueFromProps,
      defaultValue,
      className,
      refProp: ref,
      isDisabled,
      onChange,
      isInvalid,
      validationPolicy = defaultPasswordCreationPolicy,
      locales: localesFromProps = {},
      isRequired,
      ...rest
    } = props;

    const passwordCreationFieldLocales = { ...locales, ...localesFromProps };
    const translate = useLocalizedStringFormatter(passwordCreationFieldLocales);

    const promiseQueue = useRef(
      new PromiseQueue({ autoStart: true, concurrency: 1 }),
    ).current;

    const valueControlType = useRef<"controlled" | "uncontrolled">(
      valueFromProps === undefined ? "uncontrolled" : "controlled",
    ).current;
    const [uncontrolledValue, setUncontrolledValue] = useState(
      defaultValue ?? "",
    );
    const value =
      valueControlType === "controlled" ? valueFromProps : uncontrolledValue;
    const deferredValue = useDeferredValue(value);

    const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [policyValidationResult, setPolicyValidationResult] = useState<
      PolicyValidationResult | undefined
    >(undefined);

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

    useEffect(() => {
      setIsLoading(true);
      const valueToCheck = deferredValue ?? "";

      void promiseQueue.add(async () => {
        const validationResult = validationPolicy.validate(valueToCheck);
        return Promise.all([
          validationResult.isValid,
          validationResult.complexity,
          ...validationResult.ruleResults,
        ]);
      });
    }, [deferredValue, validationPolicy]);

    promiseQueue.on("completed", ([isValid, complexity, ...ruleResults]) => {
      if (promiseQueue.size === 0) {
        startTransition(() => {
          setIsLoading(false);
          setPolicyValidationResult(() => {
            if (!value) {
              // on empty values assume the state as valid but keep the single rule validations
              // to show the result in the info box without showing a complete failed validation
              return {
                isEmptyValueValidation: true,
                isValid: false,
                complexity: {
                  min: validationPolicy.minComplexity,
                  actual: 4,
                  warning: null,
                },
                ruleResults,
              };
            }

            return {
              isEmptyValueValidation: false,
              isValid,
              complexity,
              ruleResults,
            };
          });
        });
      }
    });

    const setOptimisticSuccessResult = () => {
      setPolicyValidationResult((old) => ({
        isEmptyValueValidation: false,
        ruleResults: old?.ruleResults ?? [],
        isValid: true,
        complexity: {
          warning: null,
          min: validationPolicy.minComplexity,
          actual: 4,
        },
      }));
    };

    const onPasswordGenerateHandler: ActionFn = async () => {
      if (validationPolicy) {
        const newValue = await new Generator(
          validationPolicy,
        ).generatePassword();

        if (onChange) {
          onChange(newValue);
        }

        // optimistic success since we generate
        // a password from the same policy
        setOptimisticSuccessResult();

        startTransition(() => {
          setIsPasswordRevealed(true);

          if (valueControlType === "uncontrolled") {
            setUncontrolledValue(newValue);
          }
        });
      }
    };

    const onPasswordInputChangeHandler = (value: string) => {
      if (onChange) {
        onChange(value);
      }
      if (valueControlType === "uncontrolled") {
        setUncontrolledValue(value);
      }
    };

    const onPasswordPasteHandler = () => {
      setOptimisticSuccessResult();
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
        optional: !isRequired,
        className: formFieldStyles.label,
        children: dynamic((localProps) => {
          return (
            <FieldLabel
              locales={passwordCreationFieldLocales}
              disabled={isDisabled}
              onGeneratePasswordAction={onPasswordGenerateHandler}
              ruleValidationResult={policyValidationResult?.ruleResults}
              value={value}
            >
              {localProps.children}
            </FieldLabel>
          );
        }),
      },
      FieldDescription: {
        className: formFieldStyles.fieldDescription,
      },
      FieldError: {
        className: formFieldStyles.customFieldError,
        children: dynamic((p) => {
          if (p.children) {
            return p.children;
          }

          if (translatedStatusText) {
            return translatedStatusText;
          }
        }),
      },
    };

    const rootClassName = clsx(className, formFieldStyles.formField);

    return (
      <ClearPropsContext>
        <TunnelProvider>
          <Aria.TextField
            type={isPasswordRevealed ? "text" : "password"}
            value={value}
            onChange={onPasswordInputChangeHandler}
            onPaste={onPasswordPasteHandler}
            className={rootClassName}
            isDisabled={isDisabled}
            isInvalid={
              isInvalid ||
              (!policyValidationResult?.isEmptyValueValidation &&
                !statusTextFromValidationResult?.isValid)
            }
            isRequired={isRequired}
            {...rest}
          >
            <Aria.Group
              isDisabled={isDisabled}
              className={clsx(styles.inputGroup)}
            >
              <Aria.Input className={styles.input} ref={ref} value={value} />
              <Aria.Group className={styles.buttonContainer}>
                <Action action={togglePasswordVisibilityHandler}>
                  <Button
                    data-component="toggleRevealPassword"
                    isDisabled={isDisabled}
                    className={styles.button}
                    slot="button"
                    size="m"
                    variant="plain"
                    color="secondary"
                    aria-label="Show password in plaintext"
                  >
                    {isPasswordRevealed ? <IconShow /> : <IconHide />}
                  </Button>
                </Action>
                <TunnelExit id="button" />
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
