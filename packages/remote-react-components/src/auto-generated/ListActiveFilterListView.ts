/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import createFlowRemoteComponent from "@/lib/createFlowRemoteComponent";
import { RemoteListActiveFilterListViewElement } from "@mittwald/flow-remote-elements";

export const ListActiveFilterListView = createFlowRemoteComponent(
  "flr-list-active-filter-list-view",
  "ListActiveFilterListView",
  RemoteListActiveFilterListViewElement,
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
);
