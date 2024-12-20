import type { SearchFieldProps } from "@/components/SearchField";

type SupportedSearchFieldProps = Pick<
  SearchFieldProps,
  "className" | "autoFocus"
>;

export type SearchValue = string | undefined;

export interface SearchShape<IgnoredT> {
  textFieldProps: SupportedSearchFieldProps;
  defaultValue?: string;
  autoSubmit?: boolean;
}
