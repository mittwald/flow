import React, { FC } from "react";
import styles from "./Pagination.module.scss";
import { PaginationInfos } from "@/components/List/components/Pagination/PaginationInfos";
import { ShowMoreItemsButton } from "@/components/List/components/Pagination/ShowMoreItemsButton";

export const Pagination: FC = () => {
  return (
    <div className={styles.pagination}>
      <PaginationInfos />
      <ShowMoreItemsButton />
    </div>
  );
};

export default Pagination;
