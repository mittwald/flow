import type { ChangeEventHandler } from "react";
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
import {
  getStatusFromPolicyValidationResult,
  type ResolvedPolicyValidationResult,
} from "@/components/PasswordCreationField/lib/getStatusFromPolicyValidationResult";
import getFirstErrorFromPolicyValidationResult from "@/components/PasswordCreationField/lib/getFirstErrorFromPolicyValidationResult";
import locales from "./locales/*.locale.json";
import type { LocalizedStrings } from "react-aria";
import { useLocalizedStringFormatter } from "react-aria";
import generateValidationTranslation from "@/components/PasswordCreationField/lib/generateValidationTranslation";
import { RuleType } from "@mittwald/password-tools-js/rules";
import { FieldError } from "@/components/FieldError";

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
      ...rest
    } = props;

    const passwordCreationFieldLocales = { ...locales, ...localesFromProps };
    const translate = useLocalizedStringFormatter(passwordCreationFieldLocales);

    const valueControlType = useRef<"controlled" | "uncontrolled">(
      valueFromProps === undefined ? "uncontrolled" : "controlled",
    ).current;

    const [uncontrolledValue, setUncontrolledValue] = useState(
      defaultValue ?? "",
    );
    const value =
      valueControlType === "controlled" ? valueFromProps : uncontrolledValue;

    const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [policyValidationResult, setPolicyValidationResult] = useState<
      ResolvedPolicyValidationResult | undefined
    >(undefined);

    const complexity = policyValidationResult?.complexity;
    const policyValidationStatus = getStatusFromPolicyValidationResult(
      policyValidationResult,
    );

    const complexityFulfilledPercentage =
      complexity && value
        ? Math.min((100 / (complexity.min + 1)) * (complexity.actual + 1), 100)
        : 0;

    const firstValidationResult = getFirstErrorFromPolicyValidationResult(
      policyValidationResult,
    );

    useEffect(() => {
      if (validationPolicy) {
        setIsLoading(true);
        const validationResult = validationPolicy.validate(value ?? "");
        void Promise.all([
          validationResult.isValid,
          ...validationResult.ruleResults,
        ]).then(([isValid, ...ruleResults]) =>
          startTransition(() => {
            setIsLoading(false);
            setPolicyValidationResult(() => ({
              isValid,
              complexity: validationResult.complexity,
              ruleResults,
            }));
          }),
        );
      }
    }, [value, validationPolicy]);

    const onPasswordGenerateHandler: ActionFn = async () => {
      if (validationPolicy) {
        const newValue = await new Generator(
          validationPolicy,
        ).generatePassword();

        if (onChange) {
          onChange(newValue);
        }

        startTransition(() => {
          // optimistic success since we generate
          // a password from the same policy
          setPolicyValidationResult({
            ruleResults: [],
            isValid: true,
            complexity: {
              warning: null,
              min: validationPolicy.minComplexity,
              actual: 4,
            },
          });

          setIsPasswordRevealed(true);

          if (valueControlType === "uncontrolled") {
            setUncontrolledValue(newValue);
          }
        });
      }
    };

    const onPasswordInputChangeHandler: ChangeEventHandler<HTMLInputElement> = (
      event,
    ) => {
      const newValue = event.target.value;
      if (onChange) {
        onChange(newValue);
      }
      if (valueControlType === "uncontrolled") {
        setUncontrolledValue(newValue);
      }
    };

    const togglePasswordVisibleHandler = () => {
      setIsPasswordRevealed((old) => !old);
    };

    const rootClassName = clsx(
      className,
      formFieldStyles.formField,
      styles.passwordField,
    );

    const propsContext: PropsContext = {
      Button: {
        tunnelId: "button",
        size: "m",
        variant: "plain",
        color: "dark",
        isDisabled: isDisabled,
        className: dynamic((p) => clsx(p.className, styles.button)),
      },
      Label: {
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
          if (firstValidationResult) {
            const [translationKey, translationValues] =
              generateValidationTranslation(firstValidationResult);

            return translate.format(translationKey, translationValues);
          }

          return p.children;
        }),
      },
    };

    return (
      <ClearPropsContext>
        <TunnelProvider>
          <Aria.TextField
            type={isPasswordRevealed ? "text" : "password"}
            value={value}
            onChange={onChange}
            className={rootClassName}
            isInvalid={isInvalid || (!!value && !!firstValidationResult)}
            isRequired={true}
            {...rest}
          >
            <Aria.Group className={clsx(styles.inputGroup)}>
              <Aria.Input
                disabled={isDisabled}
                onChange={onPasswordInputChangeHandler}
                className={styles.input}
                ref={ref}
                value={value}
              />
              <Aria.Group className={styles.buttonContainer}>
                <Action action={togglePasswordVisibleHandler}>
                  <Button
                    data-component="toggleRevealPassword"
                    isDisabled={isDisabled}
                    className={styles.button}
                    slot="button"
                    size="m"
                    variant="plain"
                    color="dark"
                    aria-label="Show password in plaintext"
                  >
                    {isPasswordRevealed ? <IconShow /> : <IconHide />}
                  </Button>
                </Action>
                <TunnelExit id="button" />
              </Aria.Group>
              <div
                data-container="complexity"
                data-visible={complexityFulfilledPercentage !== 0}
                data-status={policyValidationStatus}
                className={clsx(
                  styles.complexityContainer,
                  complexityFulfilledPercentage === 0 &&
                    styles.complexityContainerHide,
                )}
              >
                <div
                  style={{
                    width: `${complexityFulfilledPercentage}%`,
                  }}
                  className={clsx(
                    styles.complexity,
                    styles[
                      `complexity-background-status-${policyValidationStatus}`
                    ],
                    isLoading && styles.loading,
                    complexityFulfilledPercentage !== 100 &&
                      styles.complexityRunning,
                  )}
                />
              </div>
            </Aria.Group>
            <PropsContextProvider props={propsContext}>
              {children}
              <FieldError />
            </PropsContextProvider>
          </Aria.TextField>
        </TunnelProvider>
      </ClearPropsContext>
    );
  },
);

export default PasswordCreationField;
