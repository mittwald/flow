import type { ComponentType } from "react";
import type { TextFieldProps } from "@/components/TextField";

type SupportedTextFieldProps = Pick<TextFieldProps, "className" | "autoFocus">;

interface SearchFieldRenderProps extends SupportedTextFieldProps {
  onChange: (value: SearchValue) => unknown;
  value: SearchValue;
}

export type SearchFieldRenderComponent = ComponentType<SearchFieldRenderProps>;

export type SearchValue = string | undefined;

export interface SearchShape<IgnoredT> {
  render?: SearchFieldRenderComponent;
  textFieldProps: SupportedTextFieldProps;
}
