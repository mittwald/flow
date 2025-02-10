import type { FC } from "react";
import React from "react";
import type { ColumnLayoutProps } from "@/components/ColumnLayout";
import { ColumnLayout } from "@/components/ColumnLayout";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";

export type FileCardListProps = Omit<ColumnLayoutProps, "elementType">;

/** @flr-generate all */
export const FileCardList: FC<FileCardListProps> = (props) => {
  const { className, ...rest } = props;

  const propsContext: PropsContext = {
    FileCard: { elementType: "li" },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <ColumnLayout elementType="ul" className={className} {...rest} />
    </PropsContextProvider>
  );
};

export default FileCardList;
