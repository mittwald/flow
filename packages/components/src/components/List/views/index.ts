import type {
  ActiveFilterItem,
  ActiveFilterList,
  Header,
} from "~/components/List/views/Header";
import type { ViewComponent } from "~/lib/viewComponentContext";
import type { FilterPicker } from "~/components/List/views/Header/FilterPicker/FilterPicker";
import type { FilterPickerMenuItem } from "~/components/List/views/Header/FilterPicker/FilterPickerMenuItem";
import type Fragment from "~/components/Fragment";
import type Items from "~/components/List/views/Items/Items";
import type ItemContainer from "~/components/List/views/Items/ItemContainer";
import type List from "~/components/List/views/List/List";
import type PaginationInfos from "~/components/List/views/Footer/PaginationInfos";
import type LoadNextBatchButton from "~/components/List/views/Footer/LoadNextBatchButton";
import type { Footer } from "~/components/List/views/Footer";

export * from "./Header";
export * from "./Items";
export * from "./Footer";
export * from "./List";

declare global {
  interface FlowViewComponents {
    List: {
      Header: ViewComponent<typeof Header>;
      Fragment: ViewComponent<typeof Fragment>;
      FilterPicker: ViewComponent<typeof FilterPicker>;
      FilterPickerMenuItem: ViewComponent<typeof FilterPickerMenuItem>;
      ActiveFilterList: ViewComponent<typeof ActiveFilterList>;
      ActiveFilterItem: ViewComponent<typeof ActiveFilterItem>;
      Items: ViewComponent<typeof Items>;
      Item: ViewComponent<typeof ItemContainer>;
      List: ViewComponent<typeof List>;
      Footer: ViewComponent<typeof Footer>;
      PaginationInfos: ViewComponent<typeof PaginationInfos>;
      LoadNextBatchButton: ViewComponent<typeof LoadNextBatchButton>;
    };
  }
}
