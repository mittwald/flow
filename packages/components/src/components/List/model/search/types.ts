import type { SearchFieldProps } from "@/components/SearchField";
import type { ListSearchShape } from "@mittwald/flow-components-base";
import type { ComponentType } from "react";

export type { SearchValue } from "@mittwald/flow-components-base";

type SupportedSearchFieldProps = Pick<SearchFieldProps, "autoFocus">;

interface SearchFieldRenderProps extends SupportedSearchFieldProps {
  onChange: (value: string | undefined) => unknown;
  value: string | undefined;
  autoSubmit?: boolean;
  isDisabled?: boolean;
}

export type SearchFieldRenderComponent = ComponentType<SearchFieldRenderProps>;

export interface SearchShape<IgnoredT> extends ListSearchShape {
  render?: SearchFieldRenderComponent;
  textFieldProps: SupportedSearchFieldProps;
}
