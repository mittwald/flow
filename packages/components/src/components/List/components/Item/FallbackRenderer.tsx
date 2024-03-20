import { AnyData } from "@/components/List/model/item/types";
import React, { FC } from "react";
import { InlineCode } from "@/components/InlineCode";

interface Props {
  data: AnyData;
}

export const FallbackRenderer: FC<Props> = (props) => (
  <InlineCode>{JSON.stringify(props.data)}</InlineCode>
);
