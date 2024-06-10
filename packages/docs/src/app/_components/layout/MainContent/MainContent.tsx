import type { FC } from "react";
import React from "react";
import Heading from "@mittwald/flow-react-components/Heading";
import { Link } from "@mittwald/flow-react-components/Link";
import { LayoutCard } from "@mittwald/flow-react-components/LayoutCard";
import { Section } from "@mittwald/flow-react-components/Section";
import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";
import { IconExternalLink } from "@mittwald/flow-react-components/Icons";
import type { MdxFile } from "@/lib/mdx/MdxFile";
import MdxFileView from "@/lib/mdx/components/MdxFileView";

interface Props {
  mdxFile: MdxFile;
}

export const MainContent: FC<Props> = (props) => {
  const { mdxFile } = props;

  const component = mdxFile.mdxSource.frontmatter.component;

  return (
    <>
      <LayoutCard>
        <ColumnLayout m={component ? [1, 1] : [1]}>
          <Section>
            <Heading level={1}>{mdxFile.getTitle()}</Heading>

            {mdxFile.mdxSource.frontmatter.description}

            {component && (
              <Link href={mdxFile.getGitHubUrl()}>
                GitHub
                <IconExternalLink />
              </Link>
            )}
          </Section>

          <MdxFileView mdxFile={mdxFile.serialize()} />
        </ColumnLayout>
      </LayoutCard>
    </>
  );
};

export default MainContent;
