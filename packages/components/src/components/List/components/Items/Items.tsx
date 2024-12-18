import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List/hooks/useList";
import Item from "@/components/List/components/Items/components/Item/Item";
import { useListViewComponents } from "@/components/List";
import ItemsView from "@/components/List/viewComponents/Items/Items";

export const Items: FC = () => {
  const list = useList();
  const isLoading = list.loader.useIsLoading();
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();
  const { items: View = ItemsView } = useListViewComponents();

  const rows = list.items.entries.map((item) => (
    <Item key={item.id} data={item.data} id={item.id} />
  ));

  return (
    <View
      isLoading={isLoading}
      isInitiallyLoading={isInitiallyLoading}
      {...list.componentProps}
    >
      {rows}
    </View>
  );
};

export default Items;
