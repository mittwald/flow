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
import type { ButtonGroupProps } from "@/components/ButtonGroup";

export * from "./types";

export interface FlowComponentPropsTypes {
  Button: ButtonProps;
  ButtonGroup: ButtonGroupProps;
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
};

export const propsContextSupportingComponents = Object.keys(
  propsContextSupportingComponentsMap,
);
