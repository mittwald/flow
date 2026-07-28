"use client";
import type { FC } from "react";
import { AlertBadge, Badge } from "@mittwald/flow-react-components";
import {
  getComponentStatusInfo,
  getStatusBadges,
} from "@/lib/componentStatus/componentStatus";

interface Props {
  /** Component display name (registry lookup key on the main "." surface). */
  name: string;
}

export const ComponentStatusBadge: FC<Props> = (props) => {
  const badges = getStatusBadges(getComponentStatusInfo(props.name));

  if (badges.length === 0) {
    return null;
  }

  return (
    <>
      {badges.map((badge) =>
        badge.variant === "alert" ? (
          <AlertBadge key={badge.label} status={badge.status}>
            {badge.label}
          </AlertBadge>
        ) : (
          <Badge key={badge.label} color={badge.color}>
            {badge.label}
          </Badge>
        ),
      )}
    </>
  );
};

export default ComponentStatusBadge;
