import React, { FC } from "react";
import { PropsWithActionStates } from "@/lib/types/props";
import Icon, { IconProps } from "@/components/Icon";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

export interface ActionStateIconProps
  extends IconProps,
    PropsWithActionStates {}

export const ActionStateIcon: FC<ActionStateIconProps> = (props) => {
  const { isFailed, isPending, isSucceeded, ...rest } = props;

  if (!isPending && !isSucceeded && !isFailed) {
    return null;
  }

  return (
    <Icon
      {...rest}
      faIcon={isSucceeded ? faCheck : isFailed ? faTimes : faSpinner}
    />
  );
};

export default ActionStateIcon;
