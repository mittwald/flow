import type { FC } from "react";
import { useId } from "react";
import React from "react";
import type { MdxFile } from "@/lib/mdx/MdxFile";
import { Link } from "@mittwald/flow-react-components/Link";
import { LayoutCard } from "@mittwald/flow-react-components/LayoutCard";
import { Navigation } from "@mittwald/flow-react-components/Navigation";
import { Heading } from "@mittwald/flow-react-components/Heading";

interface Props {
  mdxFile?: MdxFile;
  className?: string;
  title: string;
}

export const SideNavigation: FC<Props> = (props) => {
  const { mdxFile } = props;

  const titleId = useId();

  const headings = mdxFile?.getHeadings();

  if (!headings || headings.length <= 0) {
    return null;
  }

  const links = headings.map((heading) => {
    if (heading.startsWith("## ")) {
      const headingId = heading.replace("## ", "");

      return (
        <Link key={headingId} href={`#${headingId}`}>
          {headingId}
        </Link>
      );
    } else if (heading.startsWith("### ")) {
      const headingId = heading.replace("### ", "");

      return (
        <Link
          style={{ marginInlineStart: "16px" }}
          key={headingId}
          href={`#${headingId}`}
        >
          {headingId}
        </Link>
      );
    }
  });

  return (
    <LayoutCard className={props.className}>
      <Navigation aria-labelledby={titleId}>
        <Heading id={titleId} level={4}>
          {props.title}
        </Heading>
        {links}
      </Navigation>
    </LayoutCard>
  );
};

export default SideNavigation;
