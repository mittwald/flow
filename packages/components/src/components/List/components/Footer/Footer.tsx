import type { FC } from "react";
import React from "react";
import styles from "./Footer.module.scss";
import { PaginationInfos } from "@/components/List/components/Footer/components/PaginationInfos";
import { ShowNextBatchButton } from "@/components/List/components/Footer/components/ShowNextBatchButton";
import { useList } from "@/components/List/hooks/useList";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import DivView from "@/views/DivView";
import LoadingSpinnerView from "@/views/LoadingSpinnerView";
import locales from "../../locales/*.locale.json";

export const Footer: FC = () => {
  const stringFormatter = useLocalizedStringFormatter(locales, "List");
  const list = useList();
  const infiniteScroll = list.infiniteScroll;
  const isLoading = list.loader.useIsLoading();
  const isInitiallyLoading = list.loader.useIsInitiallyLoading();

  const showLoadMoreSpinner =
    infiniteScroll && isLoading && !isInitiallyLoading;

  return (
    <DivView className={styles.footer}>
      <PaginationInfos />
      {!infiniteScroll && <ShowNextBatchButton />}
      {showLoadMoreSpinner && (
        <LoadingSpinnerView
          aria-label={stringFormatter.format("loadingMore")}
        />
      )}
    </DivView>
  );
};

export default Footer;
