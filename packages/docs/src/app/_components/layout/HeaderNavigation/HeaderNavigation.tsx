"use client";
import type { FC } from "react";
import React from "react";
import Navigation from "@mittwald/flow-react-components/Navigation";
import type { SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { MdxFile } from "@/lib/mdx/MdxFile";
import { groupBy } from "remeda";
import styles from "./HeaderNavigation.module.scss";
import { GroupText } from "@/app/_components/layout/MainNavigation/components/GroupText";
import { usePathname } from "next/navigation";
import { Link } from "@mittwald/flow-react-components/Link";

interface Props {
  docs: SerializedMdxFile[];
}

const HeaderNavigation: FC<Props> = (props) => {
  const docs = props.docs.map(MdxFile.deserialize);

  const navGroups = groupBy(docs, (d) => d.pathname.split("/")[1]);

  const currentPathname = usePathname();

  const navigationItems = Object.entries(navGroups).map(([group, mdxFiles]) => (
    <Link
      href={mdxFiles[0].pathname}
      key={mdxFiles[0].pathname}
      aria-current={currentPathname.includes(group) ? "page" : undefined}
    >
      <GroupText>{group}</GroupText>
    </Link>
  ));

  return (
    <Navigation aria-label="Main navigation" className={styles.navigation}>
      {navigationItems}
    </Navigation>
  );
};

export default HeaderNavigation;
