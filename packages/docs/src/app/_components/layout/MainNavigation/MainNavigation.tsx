"use client";
import React, { FC, ReactElement, useId } from "react";
import Navigation, {
  NavigationItem,
} from "@mittwald/flow-next-components/Navigation";
import Heading from "@mittwald/flow-next-components/Heading";
import { usePathname } from "next/navigation";
import styles from "./MainNavigation.module.scss";
import { MdxFile, SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { NextJsNavigationItemLink } from "@/app/_components/layout/MainNavigation/NextJsNavigationItemLink";
import { groupBy } from "remeda";
import { GroupHeadingText } from "@/app/_components/layout/MainNavigation/components/GroupHeadingText";

interface Props {
  docs: SerializedMdxFile[];
}

const MainNavigation: FC<Props> = (props) => {
  const docs = props.docs.map(MdxFile.deserialize);

  const navGroups = groupBy(docs, (d) => d.pathname.split("/")[1]);

  const headingComponentsId = useId();
  const currentPathname = usePathname();

  const navItem = (mdx: MdxFile): ReactElement => {
    const href = mdx.pathname;
    return (
      <NavigationItem
        key={href}
        href={href}
        isCurrent={href === currentPathname}
        linkComponent={NextJsNavigationItemLink}
      >
        {mdx.getNavTitle()}
      </NavigationItem>
    );
  };

  return Object.entries(navGroups).map(([group, mdxFiles]) => (
    <>
      <Heading level={4} id={headingComponentsId} className={styles.heading}>
        <GroupHeadingText>{group}</GroupHeadingText>
      </Heading>
      <Navigation aria-labelledby={headingComponentsId}>
        {mdxFiles.map(navItem)}
      </Navigation>
    </>
  ));
};

export default MainNavigation;
