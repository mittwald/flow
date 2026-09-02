"use client";
import { type FC } from "react";
import { MdxFile, type SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { groupBy } from "remeda";
import { usePathname } from "next/navigation";
import { GroupText } from "@/app/_components/layout/MainNavigation/components/GroupText";
import { Link, MenuItem } from "@mittwald/flow-react-components";
import { byContentOrder } from "@/lib/content/contentOrder";

interface Props {
  docs: SerializedMdxFile[];
  render?: "menuItem" | "link";
}

const componentsSection = "components";

export const Groups: FC<Props> = (props) => {
  const { docs, render = "link" } = props;

  const deserializedDocs = docs.map(MdxFile.deserialize);

  const navGroups = groupBy(deserializedDocs, (d) => d.pathname.split("/")[1]);

  // Compared segment by segment: `/foundations/structure/components` must not
  // mark the Components section as the current one.
  const currentSection = usePathname().split("/")[1];

  return Object.entries(navGroups)
    .sort(([a], [b]) => byContentOrder(`/${a}`, `/${b}`))
    .map(([group, mdxFiles]) => {
      // The files arrive in filesystem order, which is alphabetical — back
      // when the directories were numbered that happened to be the authored
      // order too. It no longer is, so the first page is picked explicitly.
      const pathname = mdxFiles
        .map((mdxFile) => mdxFile.pathname)
        .sort((a, b) => byContentOrder(a, b) || a.localeCompare(b))[0];

      // The components have an overview page of their own; every other section
      // links straight at its first page.
      const href = group === componentsSection ? `/${group}` : pathname;

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
          aria-current={currentSection === group ? "page" : undefined}
        >
          <GroupText>{group}</GroupText>
        </Link>
      );
    });
};

export default Groups;
