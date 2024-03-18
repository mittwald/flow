import type { TextProps } from "@/components/Text";
import type { ButtonProps } from "@/components/Button";
import type { IconProps } from "@/components/Icon";
import type { LabelProps } from "@/components/Label";
import type { ContentProps } from "@/components/Content";
import type { LayoutCardProps } from "@/components/LayoutCard";
import type {
  NavigationItemProps,
  NavigationProps,
} from "@/components/Navigation";
import type { LinkProps } from "@/components/Link";
import type { FieldErrorProps } from "@/components/FieldError";
import type { FieldDescriptionProps } from "@/components/FieldDescription";
import type { InlineAlertProps } from "@/components/InlineAlert";
import type { HeadingProps } from "@/components/Heading";
import type { InitialsProps } from "@/components/Initials";
import type { ImageProps } from "@/components/Image";
import type { CopyButtonProps } from "@/components/CopyButton";

export * from "./types";

export interface FlowComponentPropsTypes {
  Text: TextProps;
  Button: ButtonProps;
  CopyButton: CopyButtonProps;
  Icon: IconProps;
  Label: LabelProps;
  Content: ContentProps;
  LayoutCard: LayoutCardProps;
  Navigation: NavigationProps;
  NavigationItem: NavigationItemProps;
  Heading: HeadingProps;
  InlineAlert: InlineAlertProps;
  Link: LinkProps;
  Initials: InitialsProps;
  Image: ImageProps;
  FieldError: FieldErrorProps;
  FieldDescription: FieldDescriptionProps;
}
