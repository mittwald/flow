import type { FC, PropsWithChildren } from "react";
import React from "react";
import { Text } from "@/components/Text";
import { Badge } from "@/components/Badge";

export interface ActiveFilterItemProps extends PropsWithChildren {
  onRemove?: () => void;
}

/** @flr-generate all */
export const ActiveFilterItem: FC<ActiveFilterItemProps> = (props) => {
  const { children, onRemove } = props;
  return (
    <Badge onClose={onRemove}>
      <Text>{children}</Text>
    </Badge>
  );
};

export default ActiveFilterItem;
