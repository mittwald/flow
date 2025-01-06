import type { ListProps } from "@mittwald/flow-remote-elements";
import {
  RemoteListFilterPickerElement,
  RemoteListFilterPickerMenuItemElement,
  RemoteListHeaderElement,
  RemoteListActiveFilterItemElement,
  RemoteListActiveFilterListElement,
  RemoteListItemsElement,
  RemoteListItemElement,
  RemoteListElement,
  RemoteListFooterElement,
  RemoteListPaginationInfosElement,
  RemoteListLoadNextBatchButtonElement,
} from "@mittwald/flow-remote-elements";
import {
  List as FlowList,
  ListViewComponentsProvider,
} from "@mittwald/flow-react-components/List";
import type { FC } from "react";
import React from "react";
import { createRemoteComponent } from "@remote-dom/react";
import { Fragment } from "@/Fragment";

const components = {
  fragment: Fragment,

  list: createRemoteComponent("flr-list", RemoteListElement, {}),

  items: createRemoteComponent("flr-list-items", RemoteListItemsElement, {}),

  item: createRemoteComponent("flr-list-item", RemoteListItemElement, {
    eventProps: {
      onAction: { event: "action" } as never,
    },
  }),

  header: createRemoteComponent("flr-list-header", RemoteListHeaderElement, {
    slotProps: {
      wrapper: false,
    },
    eventProps: {
      onSearchChanged: { event: "searchChanged" } as never,
    },
  }),

  activeFilterList: createRemoteComponent(
    "flr-list-active-filter-list",
    RemoteListActiveFilterListElement,
    {
      slotProps: {
        wrapper: false,
      },
      eventProps: {
        onResetFilters: { event: "resetFilters" } as never,
        onClearFilters: { event: "clearFilters" } as never,
        onStoreFilterDefaultSettings: {
          event: "storeFilterDefaultSettings",
        } as never,
      },
    },
  ),

  activeFilterItem: createRemoteComponent(
    "flr-list-active-filter-item",
    RemoteListActiveFilterItemElement,
    {
      slotProps: {
        wrapper: false,
      },
      eventProps: {
        onRemove: { event: "remove" } as never,
      },
    },
  ),

  filterPicker: createRemoteComponent(
    "flr-list-filter-picker",
    RemoteListFilterPickerElement,
    {
      slotProps: {
        wrapper: false,
      },
    },
  ),

  filterPickerMenuItem: createRemoteComponent(
    "flr-list-filter-picker-menu-item",
    RemoteListFilterPickerMenuItemElement,
    {
      slotProps: {
        wrapper: false,
      },
      eventProps: {
        onAction: { event: "action" } as never,
      },
    },
  ),

  paginationInfos: createRemoteComponent(
    "flr-list-pagination-infos",
    RemoteListPaginationInfosElement,
    {},
  ),

  footer: createRemoteComponent("flr-list-footer", RemoteListFooterElement, {}),

  loadNextBatchButton: createRemoteComponent(
    "flr-list-load-next-batch-button",
    RemoteListLoadNextBatchButtonElement,
    {
      eventProps: {
        onPress: { event: "press" } as never,
      },
    },
  ),
} as const;

export const List: FC<ListProps<never>> = (props) => (
  <ListViewComponentsProvider components={components}>
    <FlowList {...props} />
  </ListViewComponentsProvider>
);
