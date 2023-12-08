import { TextProps } from "@/components/Text";
import { ButtonProps } from "@/components/Button";
import { IconProps } from "@/components/Icon";

export * from "./types";

export interface FlowComponentPropsTypes {
  text: TextProps;
  button: ButtonProps;
  icon: IconProps;
}
