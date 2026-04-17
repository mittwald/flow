import type { FC } from "react";
import styles from "../../Tabs.module.scss";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider";
import locales from "../../locales/*.locale.json";
import { IllustratedMessage } from "@/components/IllustratedMessage";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { AlertIcon } from "@/components/AlertIcon";

export const FallbackTab: FC = () => {
  const stringFormatter = useLocalizedStringFormatter(locales, "Tabs");

  return (
    <IllustratedMessage className={styles.fallbackTab} color="unavailable">
      <AlertIcon status="unavailable" />
      <Heading>{stringFormatter.format("fallbackTab.heading")}</Heading>
      <Text>{stringFormatter.format("fallbackTab.text")}</Text>
    </IllustratedMessage>
  );
};
