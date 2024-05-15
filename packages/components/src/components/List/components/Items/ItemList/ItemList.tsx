import type { FC } from "react";
import React, { Suspense } from "react";
import { useList } from "@/components/List/hooks/useList";
import styles from "./ItemList.module.css";
import clsx from "clsx";
import { Item } from "@/components/List/components/Items/Item";
import type { PropsWithClassName } from "@/lib/types/props";
import { IllustratedMessage } from "@/components/IllustratedMessage";
import { IconSearch } from "@/components/Icon/components/icons";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import locales from "../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";

type Props = PropsWithClassName;

export const ItemList: FC<Props> = (props) => {
  const { className } = props;
  const list = useList();
  const isLoading = list.loader.useIsLoading();

  const stringFormatter = useLocalizedStringFormatter(locales);

  const rows = list.items.entries.map((i) => (
    <Item key={i.id}>
      <Suspense>{i.render()}</Suspense>
    </Item>
  ));

  const rootClassName = clsx(
    styles.itemList,
    className,
    isLoading && styles.isLoading,
  );

  return (
    <>
      <div className={rootClassName}>{rows}</div>
      {rows.length <= 0 && !isLoading && (
        <IllustratedMessage>
          <IconSearch />
          <Heading>{stringFormatter.format("list.noResult.heading")}</Heading>
          <Text>{stringFormatter.format("list.noResult.text")}</Text>
        </IllustratedMessage>
      )}
    </>
  );
};

export default ItemList;
