import type { FC } from "react";
import React from "react";
import { PaginationInfos } from "@/components/List/components/Footer/components/PaginationInfos";
import { ShowNextBatchButton } from "@/components/List/components/Footer/components/ShowNextBatchButton";
import { useListViewComponents } from "@/components/List";
import { Footer as FooterView } from "../../viewComponents/Footer";

export const Footer: FC = () => {
  const { footer: View = FooterView } = useListViewComponents();

  return (
    <View>
      <PaginationInfos />
      <ShowNextBatchButton />
    </View>
  );
};

export default Footer;
