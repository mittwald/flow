import Action from "@/components/Action/Action";
import type { FC, PropsWithChildren } from "react";

export type ActionBatchProps = PropsWithChildren;

/**
 * Batches multiple actions together and shows feedback when all actions have
 * completed.
 *
 * By default async actions are automatically batched.
 */
export const ActionBatch: FC<ActionBatchProps> = (props) => {
  const { children } = props;

  return <Action>{children}</Action>;
};

export default ActionBatch;
