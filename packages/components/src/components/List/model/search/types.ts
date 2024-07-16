import type { ComponentType } from "react";

interface SearchFieldRenderProps {
  onChange: (value: SearchValue) => unknown;
  value: SearchValue;
  className?: string;
}

export type SearchFieldRenderComponent = ComponentType<SearchFieldRenderProps>;

export type SearchValue = string | undefined;

export interface SearchShape<IgnoredT> {
  render?: SearchFieldRenderComponent;
}
