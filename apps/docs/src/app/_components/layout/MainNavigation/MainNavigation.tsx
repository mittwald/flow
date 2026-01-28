"use client";
import React, { type FC, useId, useState } from "react";
import {
  Heading,
  LayoutCard,
  Navigation,
  SearchField,
  Section,
  useOnChange,
  Wrap,
} from "@mittwald/flow-react-components";
import type { SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { MdxFile } from "@/lib/mdx/MdxFile";
import { GroupText } from "@/app/_components/layout/MainNavigation/components/GroupText";
import type { MdxDirectoryTree } from "@/lib/mdx/components/buildDirectoryTree";
import { buildDirectoryTree } from "@/lib/mdx/components/buildDirectoryTree";
import { usePathname } from "next/navigation";
import styles from "@/app/layout.module.scss";
import { NavigationEntries } from "@/app/_components/layout/MainNavigation/components/NavigationEntries";

interface Props {
  docs: SerializedMdxFile[];
  mobileNavigation?: boolean;
}

export const filterBySearchValue = (
  searchValue: string,
  tree: [string, MdxDirectoryTree | MdxFile],
): boolean => {
  const [, treeItem] = tree;
  if (searchValue === "" || !(treeItem instanceof MdxFile)) {
    return true;
  }
  return treeItem.getNavTitle().toLowerCase().includes(searchValue);
};

const MainNavigation: FC<Props> = (props) => {
  const docs = props.docs.map(MdxFile.deserialize);
  const docsTree = buildDirectoryTree(docs);
  const currentPathname = usePathname();
  const mainPathSegment = currentPathname.split("/")[1];

  console.log(mainPathSegment);

  const [searchValue, setSearchValue] = useState<string>("");

  useOnChange(currentPathname, () => {
    setSearchValue("");
  });

  const headingId = useId();

  if (mainPathSegment === undefined) {
    return null;
  }

  const selectedMainBranch = docsTree[mainPathSegment];
  if (!selectedMainBranch || selectedMainBranch instanceof MdxFile) {
    return null;
  }

  return (
    <Wrap if={!props.mobileNavigation}>
      <LayoutCard className={styles.mainNavigation}>
        <Section>
          <Heading id={headingId}>
            <GroupText>{mainPathSegment}</GroupText>
          </Heading>
          <SearchField
            value={searchValue}
            onChange={(value) => setSearchValue(value.toLowerCase().trim())}
          />
          <Navigation aria-labelledby={headingId}>
            <NavigationEntries
              branch={selectedMainBranch}
              searchValue={searchValue}
            />
          </Navigation>
        </Section>
      </LayoutCard>
    </Wrap>
  );
};

export default MainNavigation;
