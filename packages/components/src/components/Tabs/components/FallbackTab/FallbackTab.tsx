import type { FC } from "react";
import styles from "../../Tabs.module.scss";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider";
import locales from "../../locales/*.locale.json";
import { IllustratedMessage } from "@/components/IllustratedMessage";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { AlertIcon } from "@/components/AlertIcon";
import type { TabsProps } from "@/components/Tabs";

type FallbackTabProps = Pick<TabsProps, "tabNotFoundView">;

export const FallbackTab: FC<FallbackTabProps> = (props) => {
  const { tabNotFoundView } = props;

  const stringFormatter = useLocalizedStringFormatter(locales, "Tabs");

  if (tabNotFoundView) {
    return <div className={styles.fallbackTab}>{tabNotFoundView}</div>;
  }

  return (
    <IllustratedMessage className={styles.fallbackTab} color="unavailable">
      <AlertIcon status="unavailable" />
      <Heading>{stringFormatter.format("fallbackTab.heading")}</Heading>
      <Text>{stringFormatter.format("fallbackTab.text")}</Text>
    </IllustratedMessage>
  );
};
