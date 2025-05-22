import type { FC } from "react";
import React from "react";
import { Button } from "@/components/Button";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import { Heading } from "@/components/Heading";
import stylesFieldLabel from "./FieldLabel.module.scss";
import type { ActionFn } from "@/components/Action";
import { Action } from "@/components/Action";
import { useLocalizedStringFormatter } from "react-aria";
import type * as Aria from "react-aria-components";
import type { ResolvedPolicyValidationResult } from "@/components/PasswordCreationField/PasswordCreationField";
import { isCryptographicSecureRandom } from "@mittwald/password-tools-js/generator";
import locales from "./../../locales/*.locale.json";
import ValidationResultEntry from "@/components/PasswordCreationField/components/ValidationResultEntry/ValidationResultEntry";
import { TunnelExit } from "@mittwald/react-tunnel";
import clsx from "clsx";

interface Props extends Pick<Aria.InputProps, "disabled"> {
  className?: string;
  policyValidationResult?: ResolvedPolicyValidationResult;
  onGeneratePasswordAction?: ActionFn;
}

/** @internal */
export const FieldLabel: FC<Props> = (props) => {
  const {
    onGeneratePasswordAction,
    policyValidationResult,
    disabled: isDisabled,
    className,
  } = props;
  const translate = useLocalizedStringFormatter(locales);

  const validationResultComponents = policyValidationResult?.ruleResults
    ?.filter((r) => {
      return policyValidationResult?.isEmptyValueValidation ? !r.isValid : true;
    })
    .map((result, index) => {
      return (
        <ValidationResultEntry
          key={`${result.identifier}-${index}`}
          result={result}
        />
      );
    });

  return (
    <div className={clsx(className, stylesFieldLabel.passwordFieldLabel)}>
      <div className={clsx(stylesFieldLabel.helperContext)}>
        <TunnelExit id="label" />
        <ContextualHelpTrigger>
          <Button
            data-component="showPasswordRules"
            isDisabled={isDisabled}
            className={clsx(
              stylesFieldLabel.button,
              stylesFieldLabel.helpButton,
            )}
          />
          <ContextualHelp>
            <Heading>
              {translate.format("password.requirements.heading")}
            </Heading>
            {validationResultComponents}
          </ContextualHelp>
        </ContextualHelpTrigger>
      </div>
      {onGeneratePasswordAction && isCryptographicSecureRandom && (
        <Action action={onGeneratePasswordAction}>
          <Button
            data-component="generatePassword"
            isDisabled={isDisabled}
            className={clsx(
              stylesFieldLabel.button,
              stylesFieldLabel.generateButton,
            )}
            variant="plain"
            color="dark"
            size="s"
          >
            {translate.format("button.generate")}
          </Button>
        </Action>
      )}
    </div>
  );
};

export default FieldLabel;
