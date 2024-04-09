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
import type {
  RadioButtonProps,
  RadioGroupProps,
  RadioProps,
} from "@/components/RadioGroup";
import type { TextFieldProps } from "@/components/TextField";
import type { NumberFieldProps } from "@/components/NumberField";
import type { TextAreaProps } from "@/components/TextArea";
import type { CheckboxGroupProps } from "@/components/CheckboxGroup";
import type { CheckboxProps } from "@/components/Checkbox";
import type { CheckboxButtonProps } from "@/components/CheckboxButton";

export * from "./types";

export interface FlowComponentPropsTypes {
  Action: ActionProps;
  Avatar: AvatarProps;
  Button: ButtonProps;
  ButtonGroup: ButtonGroupProps;
  Checkbox: CheckboxProps;
  CheckboxGroup: CheckboxGroupProps;
  CheckboxButton: CheckboxButtonProps;
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
  NumberField: NumberFieldProps;
  Radio: RadioProps;
  RadioButton: RadioButtonProps;
  RadioGroup: RadioGroupProps;
  StatusBadge: StatusBadgeProps;
  Switch: SwitchProps;
  Text: TextProps;
  TextArea: TextAreaProps;
  TextField: TextFieldProps;
}

const propsContextSupportingComponentsMap: Record<
  keyof FlowComponentPropsTypes,
  true
> = {
  Action: true,
  Avatar: true,
  Button: true,
  ButtonGroup: true,
  Checkbox: true,
  CheckboxGroup: true,
  CheckboxButton: true,
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
  NumberField: true,
  Radio: true,
  RadioButton: true,
  RadioGroup: true,
  StatusBadge: true,
  Switch: true,
  TestComponent: true,
  Text: true,
  TextArea: true,
  TextField: true,
};

export const propsContextSupportingComponents = Object.keys(
  propsContextSupportingComponentsMap,
);
