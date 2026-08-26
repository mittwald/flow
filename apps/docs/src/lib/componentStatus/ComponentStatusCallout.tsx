"use client";
import { Fragment, type FC } from "react";
import {
  Alert,
  Content,
  Heading,
  Link,
  Text,
} from "@mittwald/flow-react-components";
import { getComponentStatusInfo } from "@/lib/componentStatus/componentStatus";
import type { ReplacementLink } from "@/lib/componentStatus/replacedBy";

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
   * German copy from the page's `deprecationNotice` frontmatter. The registry's
   * own `deprecationNotice` is deliberately not used here: it comes from the
   * `@deprecated` tag, which is English for the IDE and for consumers reading
   * the status registry.
   */
  notice?: string;
  /** Successors from the page's `replacedBy` frontmatter, already resolved. */
  replacedBy?: ReplacementLink[];
}

export const ComponentStatusCallout: FC<Props> = (props) => {
  const status = getComponentStatusInfo(props.name);
  const replacedBy = props.replacedBy ?? [];

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
          <Text>{props.notice ?? DEPRECATED_FALLBACK}</Text>
          {replacedBy.length > 0 && (
            <Text>
              Ersatz:{" "}
              {replacedBy.map((replacement, index) => (
                <Fragment key={replacement.href}>
                  {index > 0 && ", "}
                  <Link href={replacement.href}>{replacement.name}</Link>
                </Fragment>
              ))}
            </Text>
          )}
        </Content>
      </Alert>
    );
  }

  return null;
};

export default ComponentStatusCallout;
