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
import { AvatarProps } from "@/components/Avatar";
import { ItemContextMenuProps } from "@/components/List/components/Items/components/ItemContextMenu/ItemContextMenu";

export * from "./types";

export interface FlowComponentPropsTypes {
  Avatar: AvatarProps;
  Button: ButtonProps;
  Content: ContentProps;
  CopyToClipboard: CopyToClipboardButtonProps;
  FieldDescription: FieldDescriptionProps;
  FieldError: FieldErrorProps;
  Heading: HeadingProps;
  Icon: IconProps;
  Image: ImageProps;
  Initials: InitialsProps;
  InlineAlert: InlineAlertProps;
  Label: LabelProps;
  LayoutCard: LayoutCardProps;
  Link: LinkProps;
  ListItemContextMenu: ItemContextMenuProps;
  Navigation: NavigationProps;
  NavigationItem: NavigationItemProps;
  Text: TextProps;
}
