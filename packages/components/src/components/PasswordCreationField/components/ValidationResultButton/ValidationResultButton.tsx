import React, { type FC } from "react";
import { useLocalizedStringFormatter } from "react-aria";

import locales from "./../../locales/*.locale.json";
import type { ResolvedPolicyValidationResult } from "@/components/PasswordCreationField/PasswordCreationField";
import ValidationResultEntry from "@/components/PasswordCreationField/components/ValidationResultEntry/ValidationResultEntry";
import { Button } from "@/components/Button";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import { Heading } from "@/components/Heading";
import type { PropsWithClassName } from "@/lib/types/props";

interface Props extends PropsWithClassName {
  policyValidationResult?: ResolvedPolicyValidationResult;
  isDisabled?: boolean;
  isEmptyValue: boolean;
}

export const ValidationResultButton: FC<Props> = (props) => {
  const { policyValidationResult, isDisabled, isEmptyValue, className } = props;

  const translate = useLocalizedStringFormatter(locales);

  let validationResults = policyValidationResult?.ruleResults?.filter((r) => {
    return isEmptyValue ? !r.isValid : true;
  });
  if (validationResults && validationResults.length === 0 && isEmptyValue) {
    // if we have no rules to show on first info - just list them all
    validationResults = policyValidationResult?.ruleResults;
  }

  const validationResultComponents =
    validationResults?.map((result, index) => {
      return (
        <ValidationResultEntry
          key={`${result.identifier}-${index}`}
          result={result}
        />
      );
    }) ?? [];

  return (
    <ContextualHelpTrigger>
      <Button
        data-component="showPasswordRules"
        isDisabled={isDisabled}
        className={className}
      />
      <ContextualHelp>
        <Heading>{translate.format("password.requirements.heading")}</Heading>
        {validationResultComponents.length === 0 && (
          <ValidationResultEntry result={{ isValid: true }} unspecifiedRules />
        )}
        {validationResultComponents}
      </ContextualHelp>
    </ContextualHelpTrigger>
  );
};
