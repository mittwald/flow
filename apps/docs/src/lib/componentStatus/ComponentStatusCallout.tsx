"use client";
import type { FC } from "react";
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
              components={createCustomComponents()}
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
