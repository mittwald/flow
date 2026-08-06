"use client";
import { type FC } from "react";
import { MdxFile, type SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { groupBy } from "remeda";
import { usePathname } from "next/navigation";
import { GroupText } from "@/app/_components/layout/MainNavigation/components/GroupText";
import { Link, MenuItem } from "@mittwald/flow-react-components";

interface Props {
  docs: SerializedMdxFile[];
  render?: "menuItem" | "link";
}

const SECTION_ORDER = [
  "01-get-started",
  "releases",
  "02-foundations",
  "03-patterns",
  "04-components",
];

const orderIndex = (group: string): number => {
  const i = SECTION_ORDER.indexOf(group);
  return i === -1 ? SECTION_ORDER.length : i;
};

export const Groups: FC<Props> = (props) => {
  const { docs, render = "link" } = props;

  const deserializedDocs = docs.map(MdxFile.deserialize);

  const navGroups = groupBy(deserializedDocs, (d) => d.pathname.split("/")[1]);

  const currentPathname = usePathname();

  return Object.entries(navGroups)
    .sort(([a], [b]) => orderIndex(a) - orderIndex(b))
    .map(([group, mdxFiles]) => {
      const pathname = mdxFiles[0].pathname;
      const isComponent = pathname.includes("04-components");
      const href = `${pathname}${isComponent ? "/overview" : ""}`;

      if (render === "menuItem") {
        return (
          <MenuItem href={href} key={pathname}>
            <GroupText>{group}</GroupText>
          </MenuItem>
        );
      }

      return (
        <Link
          href={href}
          key={pathname}
          aria-current={currentPathname.includes(group) ? "page" : undefined}
        >
          <GroupText>{group}</GroupText>
        </Link>
      );
    });
};

export default Groups;
