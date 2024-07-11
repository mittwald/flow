import type { FC } from "react";
import React from "react";
import { InlineCode } from "@/components/InlineCode";
import { ListItem } from "@/components/List";

interface Props {
  data: unknown;
}

export const FallbackRenderer: FC<Props> = (props) => (
  <ListItem>
    <InlineCode>{JSON.stringify(props.data)}</InlineCode>
  </ListItem>
);
