import type { FC } from "react";
import React from "react";
import type { ColumnLayoutProps } from "@/components/ColumnLayout";
import { ColumnLayout } from "@/components/ColumnLayout";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import styles from "./FileCardList.module.scss";
import clsx from "clsx";

export type FileCardListProps = Omit<ColumnLayoutProps, "elementType">;

export const FileCardList: FC<FileCardListProps> = (props) => {
  const { className, ...rest } = props;

  const propsContext: PropsContext = {
    FileCard: { elementType: "li", className: styles.fileCard },
  };

  const rootClassName = clsx(styles.fileCardList, className);

  return (
    <PropsContextProvider props={propsContext}>
      <ColumnLayout elementType="ul" className={rootClassName} {...rest} />
    </PropsContextProvider>
  );
};

export default FileCardList;
