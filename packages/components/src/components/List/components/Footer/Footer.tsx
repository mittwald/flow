import type { FC } from "react";
import React from "react";
import styles from "./Footer.module.scss";
import { PaginationInfos } from "@/components/List/components/Footer/components/PaginationInfos";
import { ShowNextBatchButton } from "@/components/List/components/Footer/components/ShowNextBatchButton";
import DivView from "@/views/DivView";

export const Footer: FC = () => {
  return (
    <DivView className={styles.footer}>
      <PaginationInfos />
      <ShowNextBatchButton />
    </DivView>
  );
};

export default Footer;
