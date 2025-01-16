import type { FC } from "react";
import React from "react";
import styles from "./Footer.module.scss";
import { PaginationInfos } from "~/components/List/components/Footer/components/PaginationInfos";
import { ShowNextBatchButton } from "~/components/List/components/Footer/components/ShowNextBatchButton";
import { useViewComponents } from "~/lib/viewComponentContext/useViewComponent";
import { Div } from "~/components/Div";

export const Footer: FC = () => {
  const { DivView } = useViewComponents(["Div", Div]);

  return (
    <DivView className={styles.footer}>
      <PaginationInfos />
      <ShowNextBatchButton />
    </DivView>
  );
};

export default Footer;
