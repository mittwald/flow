import Action from "@/components/Action/Action";
import type { FC, PropsWithChildren } from "react";

export type ActionBatchProps = PropsWithChildren;

/**
 * Batches multiple actions together and shows feedback when all actions have
 * completed.
 *
 * By default function actions are automatically batched. You can use this
 * component to split function actions into multiple batches with separate
 * feedback.
 */
export const ActionBatch: FC<ActionBatchProps> = (props) => {
  const { children } = props;

  return <Action>{children}</Action>;
};

export default ActionBatch;
