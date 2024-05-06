import MainContent from "@/app/_components/layout/MainContent/MainContent";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import type { StaticParams } from "@/lib/mdx/MdxFile";
import { LayoutCard } from "@mittwald/flow-react-components/LayoutCard";
import { Tabs } from "@mittwald/flow-react-components/Tabs";
import React from "react";
import TabContent from "@/app/_components/layout/TabContent/TabContent";
import SideNavigation from "@/app/_components/layout/SideNavigation/SideNavigation";
import styles from "@/app/layout.module.scss";

const contentFolder = "src/content";

interface Props {
  params: StaticParams;
}

export const generateStaticParams = async (): Promise<Array<StaticParams>> => {
  return await MdxFileFactory.generateStaticParams(contentFolder);
};

export const generateMetadata = async (props: Props) => {
  return await MdxFileFactory.generateMetadata(contentFolder, props.params);
};

export default async function Page(props: Props) {
  const indexMdxFile = await MdxFileFactory.fromParams(
    contentFolder,
    props.params,
    "index",
  );

  const overviewMdxFile = await MdxFileFactory.fromParams(
    contentFolder,
    props.params,
    "overview",
  );

  const developMdxFile = await MdxFileFactory.fromParams(
    contentFolder,
    props.params,
    "develop",
  );

  const guidelinesMdxFile = await MdxFileFactory.fromParams(
    contentFolder,
    props.params,
    "guidelines",
  );

  // ToDo: check active tab for side navigation

  return (
    <>
      {indexMdxFile && <MainContent mdxFile={indexMdxFile} />}

      {(overviewMdxFile || developMdxFile || guidelinesMdxFile) && (
        <div className={styles.mainContainer}>
          <LayoutCard className={styles.mainContent}>
            <Tabs>
              {overviewMdxFile && (
                <TabContent mdxFile={overviewMdxFile} tabTitle="Overview" />
              )}
              {developMdxFile && (
                <TabContent mdxFile={developMdxFile} tabTitle="Develop" />
              )}
              {guidelinesMdxFile && (
                <TabContent mdxFile={guidelinesMdxFile} tabTitle="Guidelines" />
              )}
            </Tabs>
          </LayoutCard>

          <SideNavigation
            className={styles.sideNavigation}
            mdxFile={overviewMdxFile}
            title="Overview"
          />
        </div>
      )}
    </>
  );
}
