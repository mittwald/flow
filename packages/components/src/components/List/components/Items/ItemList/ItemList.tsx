import type { FC } from "react";
import React, { Suspense } from "react";
import { useList } from "@/components/List/hooks/useList";
import styles from "./ItemList.module.css";
import clsx from "clsx";
import type { PropsWithClassName } from "@/lib/types/props";
import { IllustratedMessage } from "@/components/IllustratedMessage";
import { IconSearch } from "@/components/Icon/components/icons";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import locales from "../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { ItemSkeleton } from "@/components/List/components/Items/ItemSkeleton/ItemSkeleton";

type Props = PropsWithClassName;

export const ItemList: FC<Props> = (props) => {
  const { className } = props;
  const list = useList();
  const isLoading = list.loader.useIsLoading();
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();
  const listIsEmpty = list.useIsEmpty();

  const stringFormatter = useLocalizedStringFormatter(locales);

  const rows = list.items.entries.map((i) => (
    <Suspense key={i.id}>{i.render()}</Suspense>
  ));

  const rootClassName = clsx(
    styles.itemList,
    className,
    isLoading && styles.isLoading,
    list.tiles && styles.tiles,
  );

  if (listIsEmpty) {
    return (
      <IllustratedMessage>
        <IconSearch />
        <Heading>{stringFormatter.format("list.noResult.heading")}</Heading>
        <Text>{stringFormatter.format("list.noResult.text")}</Text>
      </IllustratedMessage>
    );
  }

  return (
    <div className={rootClassName}>
      {isInitiallyLoading ? skeletonItems : rows}
    </div>
  );
};

const skeletonItems = (
  <>
    <ItemSkeleton />
    <ItemSkeleton />
    <ItemSkeleton />
    <ItemSkeleton />
    <ItemSkeleton />
  </>
);

export default ItemList;
