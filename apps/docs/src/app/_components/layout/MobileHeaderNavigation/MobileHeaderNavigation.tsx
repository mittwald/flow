"use client";
import type { FC } from "react";
import React from "react";
import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  IconChevronDown,
  MenuItem,
  Text,
} from "@mittwald/flow-react-components";
import type { SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { MdxFile } from "@/lib/mdx/MdxFile";
import { groupBy } from "remeda";
import { GroupText } from "@/app/_components/layout/MainNavigation/components/GroupText";
import { usePathname } from "next/navigation";
import styles from "./MobileHeaderNavigation.module.css";

interface Props {
  docs: SerializedMdxFile[];
  className?: string;
}

const MobileHeaderNavigation: FC<Props> = (props) => {
  const docs = props.docs.map(MdxFile.deserialize);

  const navGroups = groupBy(docs, (d) => d.pathname.split("/")[1]);

  const currentPathname = usePathname();

  const menuItems = Object.entries(navGroups).map(([group, mdxFiles]) => {
    const pathname = mdxFiles[0].pathname;
    const isComponent = pathname.includes("04-components");

    return (
      <MenuItem
        href={`${pathname}${isComponent ? "/overview" : ""}`}
        key={pathname}
      >
        <GroupText>{group}</GroupText>
      </MenuItem>
    );
  });

  const currentGroup = Object.entries(navGroups).find(([group]) => {
    return currentPathname.includes(group);
  })?.[0];

  if (!currentGroup) {
    return null;
  }

  return (
    <ContextMenuTrigger>
      <Button className={styles.button}>
        <Text>
          <GroupText>{currentGroup}</GroupText>
        </Text>
        <IconChevronDown />
      </Button>
      <ContextMenu>{menuItems}</ContextMenu>
    </ContextMenuTrigger>
  );
};

export default MobileHeaderNavigation;
