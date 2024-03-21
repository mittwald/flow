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
import type { HeaderProps } from "@/components/Header/";
import type { SwitchProps } from "@/components/Switch";
import { StatusBadgeProps } from "@/components/StatusBadge";

export * from "./types";

export interface FlowComponentPropsTypes {
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
  NavigationItem: NavigationItemProps;
  StatusBadge: StatusBadgeProps;
  Switch: SwitchProps;
  Text: TextProps;
}

const propsContextSupportingComponentsMap: Record<
  keyof FlowComponentPropsTypes,
  true
> = {
  Text: true,
  Button: true,
  CopyButton: true,
  Header: true,
  Icon: true,
  Label: true,
  Content: true,
  LayoutCard: true,
  NavigationItem: true,
  Heading: true,
  InlineAlert: true,
  Link: true,
  Initials: true,
  Image: true,
  FieldError: true,
  FieldDescription: true,
  TestComponent: true,
  Switch: true,
  StatusBadge: true,
};

export const propsContextSupportingComponents = Object.keys(
  propsContextSupportingComponentsMap,
);
