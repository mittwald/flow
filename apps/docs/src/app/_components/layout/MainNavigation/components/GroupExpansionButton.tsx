"use client";
import type { FC } from "react";
import { Button, Icon } from "@mittwald/flow-react-components";
import { IconChevronsDown, IconChevronsUp } from "@tabler/icons-react";
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

  return (
    <Button
      variant="plain"
      color="secondary"
      aria-label={
        allExpanded ? "Alle Gruppen einklappen" : "Alle Gruppen ausklappen"
      }
      onPress={groupExpansion.toggle}
    >
      <Icon>{allExpanded ? <IconChevronsUp /> : <IconChevronsDown />}</Icon>
    </Button>
  );
};

export default GroupExpansionButton;
