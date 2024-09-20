import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List";
import { ActionGroup as ActionGroupComponent } from "@/components/ActionGroup";
import type { PropsWithClassName } from "@/lib/types/props";

export const ActionGroup: FC<PropsWithClassName> = (props) => {
  const { className } = props;

  const list = useList();
  const actionGroup = list.actionGroup;

  if (!actionGroup) {
    return null;
  }

  return (
    <ActionGroupComponent className={className} ignoreBreakpoint>
      {actionGroup.children}
    </ActionGroupComponent>
  );
};
