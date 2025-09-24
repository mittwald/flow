import type { FC } from "react";
import React from "react";
import type { MdxFile } from "@/lib/mdx/MdxFile";
import MdxFileView from "@/lib/mdx/components/MdxFileView";
import styles from "../../../layout.module.scss";

interface Props {
  mdxFile: MdxFile;
}

export const MainContent: FC<Props> = async (props) => {
  const { mdxFile } = props;

  return (
    <div className={styles.mainContent}>
      <MdxFileView mdxFile={mdxFile.serialize()} />
    </div>
  );
};

export default MainContent;
