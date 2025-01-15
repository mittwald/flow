import type { FC } from "react";
import React from "react";
import { useList } from "~/components/List/hooks/useList";
import Item from "~/components/List/components/Items/components/Item/Item";
import { useViewComponent } from "~/lib/viewComponentContext/useViewComponent";
import * as ListViews from "~/components/List/views";

export const Items: FC = () => {
  const list = useList();
  const isLoading = list.loader.useIsLoading();
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();

  const Views = {
    Items: useViewComponent("ListItemsView", ListViews.Items),
  };

  const rows = list.items.entries.map((item) => (
    <Item key={item.id} data={item.data} id={item.id} />
  ));

  return (
    <Views.Items
      isLoading={isLoading}
      isInitiallyLoading={isInitiallyLoading}
      {...list.componentProps}
    >
      {rows}
    </Views.Items>
  );
};

export default Items;
