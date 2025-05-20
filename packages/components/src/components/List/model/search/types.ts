import type { ComponentType } from "react";
import type { SearchFieldProps } from "@/components/SearchField";

type SupportedSearchFieldProps = Pick<SearchFieldProps, "autoFocus">;

interface SearchFieldRenderProps extends SupportedSearchFieldProps {
  onChange: (value: SearchValue) => unknown;
  value: SearchValue;
  autoSubmit?: boolean;
}

export type SearchFieldRenderComponent = ComponentType<SearchFieldRenderProps>;

export type SearchValue = string | undefined;

export interface SearchShape<IgnoredT> {
  render?: SearchFieldRenderComponent;
  textFieldProps: SupportedSearchFieldProps;
  defaultValue?: string;
}
