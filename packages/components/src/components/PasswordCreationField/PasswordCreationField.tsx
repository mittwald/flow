import React, {
  type PropsWithChildren,
  startTransition,
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
import { Policy } from "@mittwald/password-tools-js/policy";
import { Generator } from "@mittwald/password-tools-js/generator";
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
import PromiseQueue from "p-queue";
import ComplexityIndicator from "@/components/PasswordCreationField/components/ComplexityIndicator/ComplexityIndicator";
import { type PolicyValidationResult } from "@mittwald/password-tools-js/policy";
import { type RuleValidationResult } from "@mittwald/password-tools-js/rules";
import { useDebounceValue } from "usehooks-ts";

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

    const promiseQueue = useRef(
      new PromiseQueue({ autoStart: true, concurrency: 1 }),
    ).current;

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

    const initialValidationState: ResolvedPolicyValidationResult = {
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
      void promiseQueue.add(async () => {
        const validationResult = validationPolicy.validate(bouncedValue);
        return Promise.all([
          validationResult.isValid,
          validationResult.complexity,
          ...validationResult.ruleResults,
        ]);
      });
    }, [bouncedValue, validationPolicy]);

    promiseQueue.on("completed", ([isValid, complexity, ...ruleResults]) => {
      if (promiseQueue.size === 0) {
        startTransition(() => {
          setIsLoading(false);
          setPolicyValidationResult(() => {
            if (!value) {
              // on empty values assume the state as valid but keep the single rule validations
              // to show the result in the info box without showing a complete failed validation
              return {
                ...initialValidationState,
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
