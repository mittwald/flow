import type { FC } from "react";
import React from "react";
import styles from "./Footer.module.scss";
import { PaginationInfos } from "@/components/List/components/Footer/PaginationInfos";
import { ShowNextBatchButton } from "@/components/List/components/Footer/ShowNextBatchButton";

export const Footer: FC = () => {
  return (
    <div className={styles.footer}>
      <PaginationInfos />
      <ShowNextBatchButton />
    </div>
  );
};

export default Footer;
