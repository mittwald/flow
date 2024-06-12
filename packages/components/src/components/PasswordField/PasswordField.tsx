import React, { type PropsWithChildren, useMemo, useState } from "react";
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
import styles from "./PasswordField.module.scss";
import * as Aria from "react-aria-components";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import clsx from "clsx";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import { Policy } from "@mittwald/password-validation";
import { RuleType } from "@mittwald/password-validation/rules";
import Button from "@/components/Button";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import { Action } from "@/components/Action";
import PasswordFieldLabel from "@/components/PasswordField/components/PasswordFieldLabel/PasswordFieldLabel";

export interface PasswordFieldProps
  extends PropsWithChildren<
      Omit<Aria.TextFieldProps, "children" | "value" | "defaultValue">
    >,
    FlowComponentProps {
  value?: string;
  defaultValue?: string;
  validationPolicy?: Policy;
}

const policyDecl: any = {
  minComplexity: 3,
  rules: [
    {
      ruleType: RuleType.length,
      min: 8,
    },
    {
      ruleType: RuleType.charPool,
      charPools: ["special"],
    },
    {
      ruleType: RuleType.charPool,
      charPools: ["numbers"],
    },
  ],
};

const policy = Policy.fromDeclaration(policyDecl);

export const PasswordField = flowComponent("PasswordField", (props) => {
  const {
    children,
    value,
    className,
    refProp: ref,
    isDisabled,
    isRequired,
    onChange,
    ...rest
  } = props;

  const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);
  const policyValidationResult = useMemo(() => {
    if (!value) {
      return;
    }
    return policy.validate(value);
  }, [value]);

  const complexity = policyValidationResult?.complexity;
  const complexityStatus =
    complexity && complexity.actual > complexity.min
      ? "accomplished"
      : complexity && complexity.actual === complexity.min
        ? "fulfilled"
        : complexity
          ? "unsatisfied"
          : undefined;

  const onPasswordGenerateHandler = () => {
    if (onChange) {
      onChange(Math.random().toString());
    }
  };

  const propsContext: PropsContext = {
    Button: {
      tunnelId: "button",
      slot: "button",
      size: "m",
      variant: "plain",
      color: "dark",
      isDisabled: isDisabled,
    },
    Label: {
      className: formFieldStyles.label,
      optional: !isRequired,
      children: dynamic((localProps) => {
        return (
          <PasswordFieldLabel
            onGeneratePasswordAction={onPasswordGenerateHandler}
            policyRuleResults={policyValidationResult?.ruleResults}
          >
            {localProps.children}
          </PasswordFieldLabel>
        );
      }),
    },
    FieldDescription: {
      className: formFieldStyles.fieldDescription,
    },
    FieldError: {
      className: formFieldStyles.customFieldError,
    },
  };

  const rootClassName = clsx(formFieldStyles.formField, className);

  const complexityFulfilled = !!(
    complexity && complexity.actual >= complexity.min
  );
  const complexityFulfilledPercentage = complexity
    ? Math.min((100 / (complexity.min + 1)) * (complexity.actual + 1), 100)
    : 0;

  return (
    <ClearPropsContext>
      <TunnelProvider>
        <Aria.TextField
          type={isPasswordRevealed ? "text" : "password"}
          value={value}
          onChange={onChange}
          className={rootClassName}
          {...rest}
        >
          <Aria.Group className={clsx(styles.inputGroup)}>
            <Aria.Input className={styles.input} ref={ref} />
            <Aria.Group className={styles.buttons}>
              <Action action={() => setIsPasswordRevealed((old) => !old)}>
                <Button
                  slot="button"
                  size="m"
                  variant="plain"
                  aria-label="Add to favorites"
                >
                  {isPasswordRevealed ? <IconEye /> : <IconEyeClosed />}
                </Button>
              </Action>
              <TunnelExit id="button" />
            </Aria.Group>
            <div
              className={clsx(
                styles.complexityContainer,
                complexityFulfilledPercentage === 0 && styles.complexityHide,
              )}
            >
              <div
                style={{
                  width: `${complexityFulfilledPercentage}%`,
                }}
                className={clsx(
                  styles.complexity,
                  styles[`complexity-background-status-${complexityStatus}`],
                  !complexityFulfilled && styles.complexityUnsatisfied,
                )}
              />
            </div>
          </Aria.Group>
          <PropsContextProvider props={propsContext}>
            {children}
            {complexityFulfilled}
          </PropsContextProvider>
        </Aria.TextField>
      </TunnelProvider>
    </ClearPropsContext>
  );
});

export default PasswordField;
