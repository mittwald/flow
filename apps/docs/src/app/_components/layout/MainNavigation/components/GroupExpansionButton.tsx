"use client";
import type { FC } from "react";
import { Button, Icon } from "@mittwald/flow-react-components";
import { faAnglesDown, faAnglesUp } from "@fortawesome/sharp-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGroupExpansion } from "@/app/_components/layout/MainNavigation/components/GroupExpansion";
import { useComponentGrouping } from "@/app/_lib/useComponentGrouping";

export const GroupExpansionButton: FC = () => {
  const groupExpansion = useGroupExpansion();
  const { grouping } = useComponentGrouping();

  // A Section header tunnels its buttons out of this DOM position, so the
  // alphabetical view can't hide the button with CSS.
  if (!groupExpansion || grouping !== "grouped") {
    return null;
  }

  const allExpanded = groupExpansion.expandAll === true;
  const collapseIcon = <FontAwesomeIcon icon={faAnglesUp} />;
  const expandIcon = <FontAwesomeIcon icon={faAnglesDown} />;

  return (
    <Button
      variant="plain"
      color="secondary"
      aria-label={
        allExpanded ? "Alle Gruppen einklappen" : "Alle Gruppen ausklappen"
      }
      onPress={groupExpansion.toggle}
    >
      <Icon>{allExpanded ? collapseIcon : expandIcon}</Icon>
    </Button>
  );
};

export default GroupExpansionButton;
