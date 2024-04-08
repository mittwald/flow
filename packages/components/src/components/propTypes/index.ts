import type { TextProps } from "@/components/Text";
import type { ButtonProps } from "@/components/Button";
import type { IconProps } from "@/components/Icon";
import type { LabelProps } from "@/components/Label";
import type { ContentProps } from "@/components/Content";
import type { LayoutCardProps } from "@/components/LayoutCard";
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
import type { StatusBadgeProps } from "@/components/StatusBadge";
import type { ButtonGroupProps } from "@/components/ButtonGroup";
import type { AvatarProps } from "@/components/Avatar";
import type { ActionProps } from "@/components/Action";
import type { ContextMenuProps } from "@/components/ContextMenu";
import type { RadioProps } from "@/components/RadioGroup";

export * from "./types";

export interface FlowComponentPropsTypes {
  Action: ActionProps;
  Avatar: AvatarProps;
  Button: ButtonProps;
  ButtonGroup: ButtonGroupProps;
  Content: ContentProps;
  ContextMenu: ContextMenuProps;
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
  Radio: RadioProps;
  StatusBadge: StatusBadgeProps;
  Switch: SwitchProps;
  Text: TextProps;
}

const propsContextSupportingComponentsMap: Record<
  keyof FlowComponentPropsTypes,
  true
> = {
  Action: true,
  Avatar: true,
  Button: true,
  ButtonGroup: true,
  Content: true,
  ContextMenu: true,
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
  Radio: true,
  StatusBadge: true,
  Switch: true,
  TestComponent: true,
  Text: true,
};

export const propsContextSupportingComponents = Object.keys(
  propsContextSupportingComponentsMap,
);
