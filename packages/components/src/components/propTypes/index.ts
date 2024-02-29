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
import type { CopyToClipboardButtonProps } from "@/components/CopyToClipboardButton";
import { SwitchProps } from "@/components/Switch";

export * from "./types";

export interface FlowComponentPropsTypes {
  Button: ButtonProps;
  Content: ContentProps;
  CopyToClipboard: CopyToClipboardButtonProps;
  FieldDescription: FieldDescriptionProps;
  FieldError: FieldErrorProps;
  Icon: IconProps;
  Image: ImageProps;
  Initials: InitialsProps;
  InlineAlert: InlineAlertProps;
  Heading: HeadingProps;
  Label: LabelProps;
  LayoutCard: LayoutCardProps;
  Link: LinkProps;
  Navigation: NavigationProps;
  NavigationItem: NavigationItemProps;
  Switch: SwitchProps;
  Text: TextProps;
}
