"use client";
import type { FC } from "react";
import { AlertBadge, Badge } from "@mittwald/flow-react-components";
import { getComponentStatusInfo } from "@/lib/componentStatus/componentStatus";

interface Props {
  /** Component display name (registry lookup key on the main "." surface). */
  name: string;
  className?: string;
}

/**
 * A single status badge: the level (Beta/Deprecated) takes precedence over the
 * `new` flag and renders as an `AlertBadge`; `Neu` renders as a violet `Badge`
 * only for stable components. Renders nothing when there is no status.
 */
export const ComponentStatusBadge: FC<Props> = (props) => {
  const { name, className } = props;
  const status = getComponentStatusInfo(name);

  if (status?.level === "beta") {
    return (
      <AlertBadge status="info" className={className}>
        Beta
      </AlertBadge>
    );
  }
  if (status?.level === "deprecated") {
    return (
      <AlertBadge status="warning" className={className}>
        Deprecated
      </AlertBadge>
    );
  }
  if (status?.isNew) {
    return (
      <Badge color="violet" className={className}>
        Neu
      </Badge>
    );
  }

  return null;
};

export default ComponentStatusBadge;
