import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List";
import { ActionGroup as ActionGroupComponent } from "@/components/ActionGroup";

export const ActionGroup: FC = () => {
  const list = useList();
  const actionGroup = list.actionGroup;

  if (!actionGroup) {
    return null;
  }

  return <ActionGroupComponent>{actionGroup.children}</ActionGroupComponent>;
};
