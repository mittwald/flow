import type { FC } from "react";
import * as Aria from "react-aria-components";
import { Text } from "@/components/Text";
import generateValidationTranslation from "@/components/PasswordCreationField/lib/generateValidationTranslation";
import locales from "./../../locales/*.locale.json";
import styles from "./ValidationResultEntry.module.scss";
import type { RuleValidationResult } from "@/integrations/@mittwald/password-tools-js";
import AlertIcon from "@/components/AlertIcon";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";

interface Props {
  result: Partial<RuleValidationResult>;
  unspecifiedRules?: boolean;
}

/** @internal */
export const ValidationResultEntry: FC<Props> = (props) => {
  const { result, unspecifiedRules = false } = props;
  const translate = useLocalizedStringFormatter(
    locales,
    "PasswordCreationField",
  );

  const icon = (
    <AlertIcon
      status={result.isValid ? "success" : "warning"}
      // The status is spelled out as text right next to it, so the icon is
      // decorative. Overriding `AlertIcon`'s generic "Status …" label with
      // `undefined` is what makes `Icon` hide it from the accessibility tree.
      aria-label={undefined}
    />
  );

  const status = translate.format(
    result.isValid
      ? "password.requirements.rule.fulfilled"
      : "password.requirements.rule.unfulfilled",
  );

  let [translationKey, translationValues] = generateValidationTranslation(
    result,
    true,
  );

  if (unspecifiedRules) {
    translationKey = `${translationKey}.unspecified`;
    translationValues = {};
  }

  return (
    <li
      className={styles.validationResultEntry}
      data-rule={result.ruleType}
      data-rule-valid={result.isValid}
    >
      {icon}
      <Text>
        <Aria.VisuallyHidden elementType="span">{`${status}: `}</Aria.VisuallyHidden>
        {translate.format(translationKey, translationValues)}
      </Text>
    </li>
  );
};

export default ValidationResultEntry;
