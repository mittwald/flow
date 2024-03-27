import { AnyData } from "@/components/List/model/item/types";
import React, { FC } from "react";

interface Props {
  data: AnyData;
}

export const FallbackRenderer: FC<Props> = (props) => (
  <pre>{JSON.stringify(props.data)}</pre>
);
