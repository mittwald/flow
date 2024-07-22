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
import type { ActionGroupProps } from "@/components/ActionGroup";
import type { AvatarProps } from "@/components/Avatar";
import type { ActionProps } from "@/components/Action";
import type { ContextMenuProps, MenuItemProps } from "@/components/ContextMenu";
import type { OptionProps, SelectProps } from "@/components/Select";
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
import type { TabsProps } from "@/components/Tabs";
import type { ModalProps } from "@/components/Modal";
import type { SectionProps } from "@/components/Section";
import type { SliderProps } from "@/components/Slider";
import type { CounterBadgeProps } from "@/components/CounterBadge";
import type { FlowComponentName } from "@/components/propTypes/types";
import type { ContextualHelpProps } from "@/components/ContextualHelp";
import type { PopoverProps } from "@/components/Popover";
import type { ContextMenuSectionProps } from "@/components/ContextMenu/components/ContextMenuSection";
import type { OverlayTriggerProps } from "@/components/OverlayTrigger";
import type { ListProps } from "@/components/List";

export * from "./types";

export interface FlowComponentPropsTypes {
  Action: ActionProps;
  ActionGroup: ActionGroupProps;
  Avatar: AvatarProps;
  Button: ButtonProps;
  Checkbox: CheckboxProps;
  CheckboxButton: CheckboxButtonProps;
  CheckboxGroup: CheckboxGroupProps;
  Content: ContentProps;
  ContextMenu: ContextMenuProps;
  ContextMenuSection: ContextMenuSectionProps;
  ContextMenuTrigger: OverlayTriggerProps;
  ContextualHelp: ContextualHelpProps;
  CopyButton: CopyButtonProps;
  CounterBadge: CounterBadgeProps;
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
  List: ListProps;
  MenuItem: MenuItemProps;
  Modal: ModalProps;
  NumberField: NumberFieldProps;
  Option: OptionProps;
  Popover: PopoverProps;
  Radio: RadioProps;
  RadioButton: RadioButtonProps;
  RadioGroup: RadioGroupProps;
  Section: SectionProps;
  Select: SelectProps;
  Slider: SliderProps;
  StatusBadge: StatusBadgeProps;
  Switch: SwitchProps;
  Tabs: TabsProps;
  Text: TextProps;
  TextArea: TextAreaProps;
  TextField: TextFieldProps;
}

const propsContextSupportingComponentsMap: Record<
  keyof FlowComponentPropsTypes,
  true
> = {
  Action: true,
  ActionGroup: true,
  Avatar: true,
  Button: true,
  Checkbox: true,
  CheckboxButton: true,
  CheckboxGroup: true,
  Content: true,
  ContextMenu: true,
  ContextMenuSection: true,
  ContextMenuTrigger: true,
  ContextualHelp: true,
  CopyButton: true,
  CounterBadge: true,
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
  List: true,
  MenuItem: true,
  Modal: true,
  NumberField: true,
  Radio: true,
  Option: true,
  Popover: true,
  RadioButton: true,
  RadioGroup: true,
  Section: true,
  Select: true,
  Slider: true,
  StatusBadge: true,
  Switch: true,
  Tabs: true,
  TestComponent: true,
  Text: true,
  TextArea: true,
  TextField: true,
};

export const propsContextSupportingComponents = Object.keys(
  propsContextSupportingComponentsMap,
) as FlowComponentName[];
