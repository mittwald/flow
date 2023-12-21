import type { TextProps } from "@/components/Text";
import type { ButtonProps } from "@/components/Button";
import type { IconProps } from "@/components/Icon";
import type { LabelProps } from "@/components/Label";
import type { ContentProps } from "@/components/Content";
import type {
  NavigationItemProps,
  NavigationProps,
} from "@/components/Navigation";
import { FieldErrorProps } from "@/components/FieldError";
import { FieldDescriptionProps } from "@/components/FieldDescription";

export * from "./types";

export interface FlowComponentPropsTypes {
  text: TextProps;
  button: ButtonProps;
  icon: IconProps;
  label: LabelProps;
  content: ContentProps;
  navigation: NavigationProps;
  navigationItem: NavigationItemProps;
  fieldError: FieldErrorProps;
  fieldDescription: FieldDescriptionProps;
}
