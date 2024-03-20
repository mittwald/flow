import type { TextProps } from "@/components/Text";
import type { ButtonProps } from "@/components/Button";
import type { IconProps } from "@/components/Icon";
import type { LabelProps } from "@/components/Label";
import type { ContentProps } from "@/components/Content";
import type { LayoutCardProps } from "@/components/LayoutCard";
import type { NavigationItemProps } from "@/components/Navigation";
import type { LinkProps } from "@/components/Link";
import type { FieldErrorProps } from "@/components/FieldError";
import type { FieldDescriptionProps } from "@/components/FieldDescription";
import type { InlineAlertProps } from "@/components/InlineAlert";
import type { HeadingProps } from "@/components/Heading";
import type { InitialsProps } from "@/components/Initials";
import type { ImageProps } from "@/components/Image";
import type { CopyButtonProps } from "@/components/CopyButton";
import { HeaderProps } from "@/components/Header/";
import { AvatarProps } from "@/components/Avatar";
import { ListItemContextMenuProps } from "@/components/List";

export * from "./types";

export interface FlowComponentPropsTypes {
  Avatar: AvatarProps;
  Button: ButtonProps;
  Content: ContentProps;
  CopyButton: CopyButtonProps;
  FieldDescription: FieldDescriptionProps;
  FieldError: FieldErrorProps;
  Header: HeaderProps;
  Heading: HeadingProps;
  Icon: IconProps;
  Image: ImageProps;
  Initials: InitialsProps;
  InlineAlert: InlineAlertProps;
  Label: LabelProps;
  LayoutCard: LayoutCardProps;
  Link: LinkProps;
  ListItemContextMenu: ListItemContextMenuProps;
  NavigationItem: NavigationItemProps;
  Text: TextProps;
}

const propsContextSupportingComponentsMap: Record<
  keyof FlowComponentPropsTypes,
  true
> = {
  Avatar: true,
  Button: true,
  Content: true,
  CopyButton: true,
  FieldDescription: true,
  FieldError: true,
  Header: true,
  Heading: true,
  Icon: true,
  Image: true,
  Initials: true,
  InlineAlert: true,
  Label: true,
  LayoutCard: true,
  Link: true,
  ListItemContextMenu: true,
  NavigationItem: true,
  TestComponent: true,
  Text: true,
};

export const propsContextSupportingComponents = Object.keys(
  propsContextSupportingComponentsMap,
);
