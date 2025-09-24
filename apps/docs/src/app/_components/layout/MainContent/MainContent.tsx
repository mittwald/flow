import React, { type FC } from "react";
import type { MdxFile } from "@/lib/mdx/MdxFile";
import MdxFileView from "@/lib/mdx/components/MdxFileView";
import styles from "../../../layout.module.scss";
import { LayoutCard } from "@mittwald/flow-react-components";

interface Props {
  mdxFile: MdxFile;
}

export const MainContent: FC<Props> = async (props) => {
  const { mdxFile } = props;

  return (
    <LayoutCard className={styles.mainContent}>
      <MdxFileView mdxFile={mdxFile.serialize()} />
    </LayoutCard>
  );
};

export default MainContent;
