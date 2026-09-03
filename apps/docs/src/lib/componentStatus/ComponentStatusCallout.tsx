"use client";
import type { FC, PropsWithChildren } from "react";
import { Alert, Content, Heading, Text } from "@mittwald/flow-react-components";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { getComponentStatusInfo } from "@/lib/componentStatus/componentStatus";
import { createCustomComponents } from "@/lib/mdx/components/MdxFileView/customComponents";

const BETA_BODY =
  "Diese Komponente befindet sich in der Beta-Phase. Ihre API ist von der " +
  "Stabilitätsgarantie ausgenommen und kann sich auch in Minor- oder " +
  "Patch-Releases noch ändern.";

const DEPRECATED_FALLBACK =
  "Diese Komponente ist veraltet und wird in einer zukünftigen Version entfernt.";

/**
 * The page's MDX mapping, so a link in the notice behaves like a link in the
 * body — but with `p` reset to a plain `Text`: the page-body mapping caps
 * paragraphs at `--max-text-width`, which is the article column's measure, not
 * the callout's.
 */
const createNoticeComponents = () => ({
  ...createCustomComponents(),
  p: ({ children }: PropsWithChildren) => (
    <Text elementType="p">{children}</Text>
  ),
});

interface Props {
  /** Component display name (registry lookup key on the main "." surface). */
  name: string;
  /**
   * Serialized German copy from the page's `deprecationNotice` frontmatter,
   * rendered as MDX so it can link its successor inline. The registry's own
   * `deprecationNotice` is deliberately not used here: it comes from the
   * `@deprecated` tag, which is English for the IDE and for consumers reading
   * the status registry.
   */
  notice?: MDXRemoteSerializeResult;
}

export const ComponentStatusCallout: FC<Props> = (props) => {
  const status = getComponentStatusInfo(props.name);

  if (status?.level === "beta") {
    return (
      <Alert status="info">
        <Heading>Beta</Heading>
        <Content>{BETA_BODY}</Content>
      </Alert>
    );
  }

  if (status?.level === "deprecated") {
    return (
      <Alert status="warning">
        <Heading>Deprecated</Heading>
        <Content>
          {props.notice ? (
            <MDXRemote
              {...props.notice}
              components={createNoticeComponents()}
            />
          ) : (
            <Text>{DEPRECATED_FALLBACK}</Text>
          )}
        </Content>
      </Alert>
    );
  }

  return null;
};

export default ComponentStatusCallout;
