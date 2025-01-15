import type { FC } from "react";
import React from "react";
import { PaginationInfos } from "~/components/List/components/Footer/components/PaginationInfos";
import { ShowNextBatchButton } from "~/components/List/components/Footer/components/ShowNextBatchButton";
import { useViewComponent } from "~/lib/viewComponentContext/useViewComponent";
import * as ListViews from "~/components/List/views";

export const Footer: FC = () => {
  const View = useViewComponent("ListFooterView", ListViews.Footer);

  return (
    <View>
      <PaginationInfos />
      <ShowNextBatchButton />
    </View>
  );
};

export default Footer;
