import type { FC } from "react";
import React from "react";
import styles from "./Footer.module.scss";
import { PaginationInfos } from "@/components/List/components/Footer/components/PaginationInfos";
import { ShowNextBatchButton } from "@/components/List/components/Footer/components/ShowNextBatchButton";
import { InfiniteScrollSentinel } from "@/components/List/components/Footer/components/InfiniteScrollSentinel";
import { useList } from "@/components/List/hooks/useList";
import DivView from "@/views/DivView";

export const Footer: FC = () => {
  const infiniteScroll = useList().infiniteScroll;

  return (
    <DivView className={styles.footer}>
      <PaginationInfos />
      {infiniteScroll ? <InfiniteScrollSentinel /> : <ShowNextBatchButton />}
    </DivView>
  );
};

export default Footer;
