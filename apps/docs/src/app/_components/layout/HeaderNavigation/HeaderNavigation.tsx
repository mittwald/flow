"use client";
import type { FC } from "react";
import React from "react";
import { HeaderNavigation as HeaderNavigationComponent } from "@mittwald/flow-react-components";
import type { SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { MdxFile } from "@/lib/mdx/MdxFile";
import { groupBy } from "remeda";
import { GroupText } from "@/app/_components/layout/MainNavigation/components/GroupText";
import { usePathname } from "next/navigation";
import { Link } from "@mittwald/flow-react-components";

interface Props {
  docs: SerializedMdxFile[];
  className?: string;
}

const HeaderNavigation: FC<Props> = (props) => {
  const docs = props.docs.map(MdxFile.deserialize);

  const navGroups = groupBy(docs, (d) => d.pathname.split("/")[1]);

  const currentPathname = usePathname();

  const navigationItems = Object.entries(navGroups).map(([group, mdxFiles]) => {
    const pathname = mdxFiles[0].pathname;
    const isComponent = pathname.includes("03-components");

    return (
      <Link
        href={`${pathname}${isComponent ? "/overview" : ""}`}
        key={pathname}
        aria-current={currentPathname.includes(group) ? "page" : undefined}
      >
        <GroupText>{group}</GroupText>
      </Link>
    );
  });

  return (
    <HeaderNavigationComponent
      className={props.className}
      aria-label="Header Navigation"
    >
      {navigationItems}
    </HeaderNavigationComponent>
  );
};

export default HeaderNavigation;
