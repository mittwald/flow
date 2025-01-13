import type { FC, PropsWithChildren } from "react";
import React from "react";
import { connectHostIframeRef } from "@mittwald/flow-remote-core";
import { ViewComponentContextProvider } from "@mittwald/flow-react-components/ViewComponentContext";
import {
  Fragment,
  ListActiveFilterItemView,
  ListActiveFilterListView,
  ListFilterPickerMenuItemView,
  ListFilterPickerView,
  ListFooterView,
  ListHeaderView,
  ListItemsView,
  ListItemContainerView,
  ListListView,
  ListLoadNextBatchButtonView,
  ListPaginationInfosView,
  ReactHookFormFieldContentView,
} from "@/auto-generated";

type Props = PropsWithChildren;

export const Root: FC<Props> = (props) => {
  const { children } = props;

  return (
    <div ref={connectHostIframeRef}>
      <ViewComponentContextProvider
        components={{
          Field: {
            Content: ReactHookFormFieldContentView,
          },
          List: {
            Header: ListHeaderView,
            Footer: ListFooterView,
            Fragment: Fragment,
            PaginationInfos: ListPaginationInfosView,
            ActiveFilterItem: ListActiveFilterItemView,
            ActiveFilterList: ListActiveFilterListView,
            FilterPicker: ListFilterPickerView,
            FilterPickerMenuItem: ListFilterPickerMenuItemView,
            LoadNextBatchButton: ListLoadNextBatchButtonView,
            Items: ListItemsView,
            Item: ListItemContainerView,
            List: ListListView as never,
          },
        }}
      >
        {children}
      </ViewComponentContextProvider>
    </div>
  );
};
