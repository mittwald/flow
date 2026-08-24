"use client";
import type { FC } from "react";
import { Alert, Content, Heading } from "@mittwald/flow-react-components";
import { getComponentStatusInfo } from "@/lib/componentStatus/componentStatus";

const BETA_BODY =
  "Diese Komponente befindet sich in der Beta-Phase. Ihre API ist von der " +
  "Stabilitätsgarantie ausgenommen und kann sich auch in Minor- oder " +
  "Patch-Releases noch ändern.";

const DEPRECATED_FALLBACK =
  "Diese Komponente ist veraltet und wird in einer zukünftigen Version entfernt.";

interface Props {
  /** Component display name (registry lookup key on the main "." surface). */
  name: string;
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
        <Content>{status.deprecationNotice ?? DEPRECATED_FALLBACK}</Content>
      </Alert>
    );
  }

  return null;
};

export default ComponentStatusCallout;
