import type { FC } from "react";
import React from "react";
import { IllustratedMessage } from "@/components/IllustratedMessage";
import { IconSearch } from "@/components/Icon/components/icons";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import locales from "../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import styles from "../../components/Items/Items.module.scss";

export type EmptyViewProps = Record<string, never>;

/** @flr-generate all */
export const EmptyView: FC<EmptyViewProps> = () => {
  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <IllustratedMessage className={styles.emptyView}>
      <IconSearch />
      <Heading>{stringFormatter.format("list.noResult.heading")}</Heading>
      <Text>{stringFormatter.format("list.noResult.text")}</Text>
    </IllustratedMessage>
  );
};
