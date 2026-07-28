"use client";
import type { FC } from "react";
import { Alert, Content, Heading } from "@mittwald/flow-react-components";
import {
  getComponentStatusInfo,
  getStatusCallout,
} from "@/lib/componentStatus/componentStatus";

interface Props {
  /** Component display name (registry lookup key on the main "." surface). */
  name: string;
}

export const ComponentStatusCallout: FC<Props> = (props) => {
  const callout = getStatusCallout(getComponentStatusInfo(props.name));

  if (!callout) {
    return null;
  }

  return (
    <Alert status={callout.status}>
      <Heading>{callout.heading}</Heading>
      <Content>{callout.body}</Content>
    </Alert>
  );
};

export default ComponentStatusCallout;
