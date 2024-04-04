import React, { FC } from "react";
import styles from "./Footer.module.scss";
import { PaginationInfos } from "@/components/List/components/Footer/PaginationInfos";
import { ShowMoreItemsButton } from "@/components/List/components/Footer/ShowMoreItemsButton";

export const Footer: FC = () => {
  return (
    <div className={styles.footer}>
      <PaginationInfos />
      <ShowMoreItemsButton />
    </div>
  );
};

export default Footer;
