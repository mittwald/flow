import type { TextProps } from "@/components/Text";
import type { ButtonProps } from "@/components/Button";
import type { IconProps } from "@/components/Icon";
import type { LabelProps } from "@/components/Label";
import type { ContentProps } from "@/components/Content";
import type { LayoutCardProps } from "@/components/LayoutCard";
import type { LinkProps } from "@/components/Link";
import type { FieldErrorProps } from "@/components/FieldError";
import type { FieldDescriptionProps } from "@/components/FieldDescription";
import type { AlertProps } from "@/components/Alert";
import type { HeadingProps } from "@/components/Heading";
import type { InitialsProps } from "@/components/Initials";
import type { ImageProps } from "@/components/Image";
import type { CopyButtonProps } from "@/components/CopyButton";
import type { HeaderProps } from "@/components/Header/";
import type { SwitchProps } from "@/components/Switch";
import type { AlertBadgeProps } from "@/components/AlertBadge";
import type { ActionGroupProps } from "@/components/ActionGroup";
import type { AvatarProps } from "@/components/Avatar";
import type { ActionProps } from "@/components/Action";
import type { ContextMenuProps, MenuItemProps } from "@/components/ContextMenu";
import type { SelectProps } from "@/components/Select";
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
import type { SearchFieldProps } from "@/components/SearchField";
import type { BadgeProps } from "@/components/Badge";
import type { DatePickerProps } from "@/components/DatePicker";
import type * as Aria from "react-aria-components";
import type { DateRangePickerProps } from "@/components/DateRangePicker";
import type { TimeFieldProps } from "@/components/TimeField";
import type { AlertIconProps } from "@/components/AlertIcon";
import type { ListSummaryProps } from "@/components/List/components/ListSummary/ListSummary";
import type { ComboBoxProps } from "src/components/ComboBox";
import type { OptionProps } from "@/components/Options";

export * from "./types";

export interface FlowComponentPropsTypes {
  Action: ActionProps;
  ActionGroup: ActionGroupProps;
  Alert: AlertProps;
  AlertBadge: AlertBadgeProps;
  AlertIcon: AlertIconProps;
  ComboBox: ComboBoxProps;
  Avatar: AvatarProps;
  Badge: BadgeProps;
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
  DatePicker: DatePickerProps<Aria.DateValue>;
  DateRangePicker: DateRangePickerProps<Aria.DateValue>;
  FieldDescription: FieldDescriptionProps;
  FieldError: FieldErrorProps;
  Header: HeaderProps;
  Heading: HeadingProps;
  Icon: IconProps;
  Image: ImageProps;
  Initials: InitialsProps;
  Label: LabelProps;
  LayoutCard: LayoutCardProps;
  Link: LinkProps;
  List: ListProps<never>;
  ListSummary: ListSummaryProps;
  MenuItem: MenuItemProps;
  Modal: ModalProps;
  ModalTrigger: OverlayTriggerProps;
  NumberField: NumberFieldProps;
  Option: OptionProps;
  Popover: PopoverProps;
  PopoverTrigger: OverlayTriggerProps;
  Radio: RadioProps;
  RadioButton: RadioButtonProps;
  RadioGroup: RadioGroupProps;
  SearchField: SearchFieldProps;
  Section: SectionProps;
  Select: SelectProps;
  Slider: SliderProps;
  Switch: SwitchProps;
  Tabs: TabsProps;
  TabTitle: TabsProps;
  Text: TextProps;
  TextArea: TextAreaProps;
  TextField: TextFieldProps;
  TimeField: TimeFieldProps<Aria.TimeValue>;
}

const propsContextSupportingComponentsMap: Record<
  keyof FlowComponentPropsTypes,
  true
> = {
  Action: true,
  ActionGroup: true,
  Alert: true,
  AlertBadge: true,
  AlertIcon: true,
  ComboBox: true,
  Avatar: true,
  Badge: true,
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
  DatePicker: true,
  DateRangePicker: true,
  FieldDescription: true,
  FieldError: true,
  Header: true,
  Heading: true,
  Icon: true,
  Image: true,
  Initials: true,
  Label: true,
  LayoutCard: true,
  Link: true,
  List: true,
  ListSummary: true,
  MenuItem: true,
  Modal: true,
  ModalTrigger: true,
  NumberField: true,
  Radio: true,
  Option: true,
  Popover: true,
  PopoverTrigger: true,
  RadioButton: true,
  RadioGroup: true,
  SearchField: true,
  Section: true,
  Select: true,
  Slider: true,
  Switch: true,
  Tabs: true,
  TabTitle: true,
  TestComponent: true,
  Text: true,
  TextArea: true,
  TextField: true,
  TimeField: true,
};

export const propsContextSupportingComponents = Object.keys(
  propsContextSupportingComponentsMap,
) as FlowComponentName[];
