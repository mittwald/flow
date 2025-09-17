import type { TextProps } from "@/components/Text";
import type { ButtonProps } from "@/components/Button";
import type { IconProps } from "@/components/Icon";
import type { LabelProps } from "@/components/Label";
import type { ContentProps } from "@/components/Content";
import type { LayoutCardProps } from "@/components/LayoutCard";
import type { LinkProps } from "@/components/Link";
import type { LightBoxProps } from "@/components/LightBox";
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
import type {
  ContextMenuProps,
  ContextMenuTriggerProps,
  MenuItemProps,
} from "@/components/ContextMenu";
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
import type {
  ContextualHelpProps,
  ContextualHelpTriggerProps,
} from "@/components/ContextualHelp";
import type { PopoverProps, PopoverTriggerProps } from "@/components/Popover";
import type { ContextMenuSectionProps } from "@/components/ContextMenu/components/ContextMenuSection";
import type { ListProps } from "@/components/List";
import type { PasswordCreationFieldProps } from "@/components/PasswordCreationField";
import type { SearchFieldProps } from "@/components/SearchField";
import type { BadgeProps } from "@/components/Badge";
import type { DatePickerProps } from "@/components/DatePicker";
import type * as Aria from "react-aria-components";
import type { DateRangePickerProps } from "@/components/DateRangePicker";
import type { TimeFieldProps } from "@/components/TimeField";
import type { AlertIconProps } from "@/components/AlertIcon";
import type { ListSummaryProps } from "@/components/List/components/ListSummary/ListSummary";
import type { SegmentedControlProps } from "@/components/SegmentedControl";
import type { SegmentProps } from "@/components/SegmentedControl/components/Segment";
import type { FileCardProps } from "@/components/FileCard";
import type { FileFieldProps } from "@/components/FileField";
import type { AlignProps } from "@/components/Align";
import type { CountryOptionsProps } from "src/components/CountryOptions";
import type { ComboBoxProps } from "@/components/ComboBox";
import type { OptionProps } from "@/components/Option";
import type { MessageProps } from "@/components/Message";
import type { MessageThreadProps } from "@/components/MessageThread";
import type { FileCardListProps } from "@/components/FileCardList";
import type { AccentBoxProps } from "@/components/AccentBox";
import type { ColumnLayoutProps } from "@/components/ColumnLayout";
import type { MenuTriggerProps } from "@/components/OverlayTrigger";
import type { ProgressBarProps } from "@/components/ProgressBar";
import type { FileDropZoneProps } from "@/components/FileDropZone";
import type { NavigationProps } from "@/components/Navigation";
import type { NavigationGroupProps } from "@/components/Navigation/components/NavigationGroup";
import type { AutocompleteProps } from "@/components/Autocomplete/Autocomplete";
import type { OptionsProps } from "@/components/Options/Options";
import type { MarkdownEditorProps } from "@/components/MarkdownEditor";

export * from "./types";

export interface FlowComponentPropsTypes {
  AccentBox: AccentBoxProps;
  Action: ActionProps;
  ActionGroup: ActionGroupProps;
  Alert: AlertProps;
  AlertBadge: AlertBadgeProps;
  AlertIcon: AlertIconProps;
  Align: AlignProps;
  Avatar: AvatarProps;
  Autocomplete: AutocompleteProps;
  Badge: BadgeProps;
  Button: ButtonProps;
  Checkbox: CheckboxProps;
  CheckboxButton: CheckboxButtonProps;
  CheckboxGroup: CheckboxGroupProps;
  ColumnLayout: ColumnLayoutProps;
  ComboBox: ComboBoxProps;
  Content: ContentProps;
  ContextMenu: ContextMenuProps;
  ContextMenuSection: ContextMenuSectionProps;
  ContextMenuTrigger: ContextMenuTriggerProps;
  ContextualHelp: ContextualHelpProps;
  ContextualHelpTrigger: ContextualHelpTriggerProps;
  CopyButton: CopyButtonProps;
  CounterBadge: CounterBadgeProps;
  CountryOptions: CountryOptionsProps;
  DatePicker: DatePickerProps<Aria.DateValue>;
  DateRangePicker: DateRangePickerProps<Aria.DateValue>;
  FieldDescription: FieldDescriptionProps;
  FieldError: FieldErrorProps;
  FileCard: FileCardProps;
  FileCardList: FileCardListProps;
  FileField: FileFieldProps;
  FileDropZone: FileDropZoneProps;
  Header: HeaderProps;
  Heading: HeadingProps;
  Icon: IconProps;
  Image: ImageProps;
  Initials: InitialsProps;
  Label: LabelProps;
  LayoutCard: LayoutCardProps;
  LightBox: LightBoxProps;
  Link: LinkProps;
  List: ListProps<never>;
  ListSummary: ListSummaryProps;
  MarkdownEditor: MarkdownEditorProps;
  MenuItem: MenuItemProps;
  MenuTrigger: MenuTriggerProps;
  Message: MessageProps;
  MessageThread: MessageThreadProps;
  Modal: ModalProps;
  Navigation: NavigationProps;
  NavigationGroup: NavigationGroupProps;
  NumberField: NumberFieldProps;
  Option: OptionProps;
  Options: OptionsProps;
  Popover: PopoverProps;
  PopoverTrigger: PopoverTriggerProps;
  PasswordCreationField: PasswordCreationFieldProps;
  ProgressBar: ProgressBarProps;
  Radio: RadioProps;
  RadioButton: RadioButtonProps;
  RadioGroup: RadioGroupProps;
  SearchField: SearchFieldProps;
  Section: SectionProps;
  Segment: SegmentProps;
  SegmentedControl: SegmentedControlProps;
  Select: SelectProps;
  Slider: SliderProps;
  Switch: SwitchProps;
  Tabs: TabsProps;
  TabTitle: TabsProps;
  Text: TextProps;
  TextArea: TextAreaProps;
  TextField: TextFieldProps;
  TimeField: TimeFieldProps;
}

const propsContextSupportingComponentsMap: Record<
  keyof FlowComponentPropsTypes,
  true
> = {
  AccentBox: true,
  Action: true,
  ActionGroup: true,
  Avatar: true,
  Autocomplete: true,
  Alert: true,
  AlertBadge: true,
  AlertIcon: true,
  Align: true,
  Badge: true,
  Button: true,
  Checkbox: true,
  CheckboxButton: true,
  CheckboxGroup: true,
  ColumnLayout: true,
  ComboBox: true,
  Content: true,
  ContextMenu: true,
  ContextMenuSection: true,
  ContextMenuTrigger: true,
  ContextualHelp: true,
  ContextualHelpTrigger: true,
  CopyButton: true,
  CounterBadge: true,
  CountryOptions: true,
  DatePicker: true,
  DateRangePicker: true,
  FieldDescription: true,
  FieldError: true,
  FileCard: true,
  FileCardList: true,
  FileField: true,
  FileDropZone: true,
  Header: true,
  Heading: true,
  Icon: true,
  Image: true,
  Initials: true,
  Label: true,
  LayoutCard: true,
  LightBox: true,
  Link: true,
  List: true,
  ListSummary: true,
  MarkdownEditor: true,
  MenuItem: true,
  MenuTrigger: true,
  Message: true,
  MessageThread: true,
  Modal: true,
  Navigation: true,
  NavigationGroup: true,
  NumberField: true,
  Radio: true,
  Option: true,
  Options: true,
  Popover: true,
  PopoverTrigger: true,
  PasswordCreationField: true,
  ProgressBar: true,
  RadioButton: true,
  RadioGroup: true,
  SearchField: true,
  Section: true,
  Segment: true,
  SegmentedControl: true,
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
