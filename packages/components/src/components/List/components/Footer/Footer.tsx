import type { FC } from "react";
import React from "react";
import { PaginationInfos } from "~/components/List/components/Footer/components/PaginationInfos";
import { ShowNextBatchButton } from "~/components/List/components/Footer/components/ShowNextBatchButton";
import { Footer as DefaultView } from "../../views/Footer";
import { useViewComponents } from "~/lib/viewComponentContext/useViewComponents";

export const Footer: FC = () => {
  const View = useViewComponents("List").Footer ?? DefaultView;

  return (
    <View>
      <PaginationInfos />
      <ShowNextBatchButton />
    </View>
  );
};

export default Footer;
