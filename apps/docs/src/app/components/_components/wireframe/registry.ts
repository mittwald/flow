"use client";
import type { FC } from "react";
import { PlaceholderWireframe } from "@/app/components/_components/wireframe/PlaceholderWireframe";
import { AccordionWireframe } from "@/app/components/_components/wireframe/wireframes/Accordion";
import { AccentBoxWireframe } from "@/app/components/_components/wireframe/wireframes/AccentBox";
import { ActionGroupWireframe } from "@/app/components/_components/wireframe/wireframes/ActionGroup";
import { ActionWireframe } from "@/app/components/_components/wireframe/wireframes/Action";
import { AlertBadgeWireframe } from "@/app/components/_components/wireframe/wireframes/AlertBadge";
import { AlertTextWireframe } from "@/app/components/_components/wireframe/wireframes/AlertText";
import { AlertWireframe } from "@/app/components/_components/wireframe/wireframes/Alert";
import { AutocompleteWireframe } from "@/app/components/_components/wireframe/wireframes/Autocomplete";
import { AvatarStackWireframe } from "@/app/components/_components/wireframe/wireframes/AvatarStack";
import { AvatarWireframe } from "@/app/components/_components/wireframe/wireframes/Avatar";
import { BadgeWireframe } from "@/app/components/_components/wireframe/wireframes/Badge";
import { BigNumberWireframe } from "@/app/components/_components/wireframe/wireframes/BigNumber";
import { BreadcrumbWireframe } from "@/app/components/_components/wireframe/wireframes/Breadcrumb";
import { ButtonWireframe } from "@/app/components/_components/wireframe/wireframes/Button";
import { CartesianChartWireframe } from "@/app/components/_components/wireframe/wireframes/CartesianChart";
import { ChatWireframe } from "@/app/components/_components/wireframe/wireframes/Chat";
import { CheckboxButtonWireframe } from "@/app/components/_components/wireframe/wireframes/CheckboxButton";
import { CheckboxGroupWireframe } from "@/app/components/_components/wireframe/wireframes/CheckboxGroup";
import { CheckboxWireframe } from "@/app/components/_components/wireframe/wireframes/Checkbox";
import { CodeBlockWireframe } from "@/app/components/_components/wireframe/wireframes/CodeBlock";
import { CodeEditorWireframe } from "@/app/components/_components/wireframe/wireframes/CodeEditor";
import { ColorWireframe } from "@/app/components/_components/wireframe/wireframes/Color";
import { ColumnLayoutWireframe } from "@/app/components/_components/wireframe/wireframes/ColumnLayout";
import { CombineWireframe } from "@/app/components/_components/wireframe/wireframes/Combine";
import { ComboBoxWireframe } from "@/app/components/_components/wireframe/wireframes/ComboBox";
import { ContextMenuWireframe } from "@/app/components/_components/wireframe/wireframes/ContextMenu";
import { ContextualHelpWireframe } from "@/app/components/_components/wireframe/wireframes/ContextualHelp";
import { CopyButtonWireframe } from "@/app/components/_components/wireframe/wireframes/CopyButton";
import { CounterBadgeWireframe } from "@/app/components/_components/wireframe/wireframes/CounterBadge";
import { DatePickerWireframe } from "@/app/components/_components/wireframe/wireframes/DatePicker";
import { DateRangePickerWireframe } from "@/app/components/_components/wireframe/wireframes/DateRangePicker";
import { DonutChartWireframe } from "@/app/components/_components/wireframe/wireframes/DonutChart";
import { FieldWireframe } from "@/app/components/_components/wireframe/wireframes/Field";
import { FileCardListWireframe } from "@/app/components/_components/wireframe/wireframes/FileCardList";
import { FileCardWireframe } from "@/app/components/_components/wireframe/wireframes/FileCard";
import { FileDropZoneWireframe } from "@/app/components/_components/wireframe/wireframes/FileDropZone";
import { FileFieldWireframe } from "@/app/components/_components/wireframe/wireframes/FileField";
import { FlexWireframe } from "@/app/components/_components/wireframe/wireframes/Flex";
import { FormRootErrorWireframe } from "@/app/components/_components/wireframe/wireframes/FormRootError";
import { FormWireframe } from "@/app/components/_components/wireframe/wireframes/Form";
import { HeaderNavigationWireframe } from "@/app/components/_components/wireframe/wireframes/HeaderNavigation";
import { HeadingWireframe } from "@/app/components/_components/wireframe/wireframes/Heading";
import { IconWireframe } from "@/app/components/_components/wireframe/wireframes/Icon";
import { IllustratedMessageWireframe } from "@/app/components/_components/wireframe/wireframes/IllustratedMessage";
import { ImageCropperWireframe } from "@/app/components/_components/wireframe/wireframes/ImageCropper";
import { ImageWireframe } from "@/app/components/_components/wireframe/wireframes/Image";
import { InlineCodeWireframe } from "@/app/components/_components/wireframe/wireframes/InlineCode";
import { KbdWireframe } from "@/app/components/_components/wireframe/wireframes/Kbd";
import { LabelWireframe } from "@/app/components/_components/wireframe/wireframes/Label";
import { LabeledValueWireframe } from "@/app/components/_components/wireframe/wireframes/LabeledValue";
import { LayoutCardWireframe } from "@/app/components/_components/wireframe/wireframes/LayoutCard";
import { LightBoxWireframe } from "@/app/components/_components/wireframe/wireframes/LightBox";
import { LinkWireframe } from "@/app/components/_components/wireframe/wireframes/Link";
import { ListWireframe } from "@/app/components/_components/wireframe/wireframes/List";
import { LoadingSpinnerWireframe } from "@/app/components/_components/wireframe/wireframes/LoadingSpinner";
import { MarkdownEditorWireframe } from "@/app/components/_components/wireframe/wireframes/MarkdownEditor";
import { MarkdownWireframe } from "@/app/components/_components/wireframe/wireframes/Markdown";
import { MessageThreadWireframe } from "@/app/components/_components/wireframe/wireframes/MessageThread";
import { MessageWireframe } from "@/app/components/_components/wireframe/wireframes/Message";
import { ModalWireframe } from "@/app/components/_components/wireframe/wireframes/Modal";
import { NavigationWireframe } from "@/app/components/_components/wireframe/wireframes/Navigation";
import { NotificationWireframe } from "@/app/components/_components/wireframe/wireframes/Notification";
import { NumberFieldWireframe } from "@/app/components/_components/wireframe/wireframes/NumberField";
import { PasswordCreationFieldWireframe } from "@/app/components/_components/wireframe/wireframes/PasswordCreationField";
import { ProgressBarWireframe } from "@/app/components/_components/wireframe/wireframes/ProgressBar";
import { RadioGroupWireframe } from "@/app/components/_components/wireframe/wireframes/RadioGroup";
import { RatingWireframe } from "@/app/components/_components/wireframe/wireframes/Rating";
import { SearchFieldWireframe } from "@/app/components/_components/wireframe/wireframes/SearchField";
import { SectionWireframe } from "@/app/components/_components/wireframe/wireframes/Section";
import { SegmentedControlWireframe } from "@/app/components/_components/wireframe/wireframes/SegmentedControl";
import { SelectWireframe } from "@/app/components/_components/wireframe/wireframes/Select";
import { SeparatorWireframe } from "@/app/components/_components/wireframe/wireframes/Separator";
import { SkeletonTextWireframe } from "@/app/components/_components/wireframe/wireframes/SkeletonText";
import { SkeletonWireframe } from "@/app/components/_components/wireframe/wireframes/Skeleton";
import { SliderWireframe } from "@/app/components/_components/wireframe/wireframes/Slider";
import { SubmitButtonWireframe } from "@/app/components/_components/wireframe/wireframes/SubmitButton";
import { SwitchWireframe } from "@/app/components/_components/wireframe/wireframes/Switch";
import { TabNavigationWireframe } from "@/app/components/_components/wireframe/wireframes/TabNavigation";
import { TableWireframe } from "@/app/components/_components/wireframe/wireframes/Table";
import { TabsWireframe } from "@/app/components/_components/wireframe/wireframes/Tabs";
import { TextAreaWireframe } from "@/app/components/_components/wireframe/wireframes/TextArea";
import { TextFieldWireframe } from "@/app/components/_components/wireframe/wireframes/TextField";
import { TextWireframe } from "@/app/components/_components/wireframe/wireframes/Text";
import { TimeFieldWireframe } from "@/app/components/_components/wireframe/wireframes/TimeField";
import { TooltipWireframe } from "@/app/components/_components/wireframe/wireframes/Tooltip";
import { TruncateWireframe } from "@/app/components/_components/wireframe/wireframes/Truncate";
import NotificationProviderWireframe from "@/app/components/_components/wireframe/wireframes/NotificationProvider";

const wireframes: Record<string, FC> = {
  accordion: AccordionWireframe,
  "accent-box": AccentBoxWireframe,
  "action-group": ActionGroupWireframe,
  action: ActionWireframe,
  "alert-badge": AlertBadgeWireframe,
  "alert-text": AlertTextWireframe,
  alert: AlertWireframe,
  // `align` is the deprecated name of `combine` and shares its wireframe.
  align: CombineWireframe,
  autocomplete: AutocompleteWireframe,
  "avatar-stack": AvatarStackWireframe,
  avatar: AvatarWireframe,
  badge: BadgeWireframe,
  "big-number": BigNumberWireframe,
  breadcrumb: BreadcrumbWireframe,
  button: ButtonWireframe,
  "cartesian-chart": CartesianChartWireframe,
  chat: ChatWireframe,
  "checkbox-button": CheckboxButtonWireframe,
  "checkbox-group": CheckboxGroupWireframe,
  checkbox: CheckboxWireframe,
  "code-block": CodeBlockWireframe,
  "code-editor": CodeEditorWireframe,
  color: ColorWireframe,
  "column-layout": ColumnLayoutWireframe,
  combine: CombineWireframe,
  "combo-box": ComboBoxWireframe,
  "context-menu": ContextMenuWireframe,
  "contextual-help": ContextualHelpWireframe,
  "copy-button": CopyButtonWireframe,
  "counter-badge": CounterBadgeWireframe,
  "date-picker": DatePickerWireframe,
  "date-range-picker": DateRangePickerWireframe,
  "donut-chart": DonutChartWireframe,
  field: FieldWireframe,
  "file-card-list": FileCardListWireframe,
  "file-card": FileCardWireframe,
  "file-drop-zone": FileDropZoneWireframe,
  "file-field": FileFieldWireframe,
  flex: FlexWireframe,
  "form-root-error": FormRootErrorWireframe,
  form: FormWireframe,
  "header-navigation": HeaderNavigationWireframe,
  heading: HeadingWireframe,
  icon: IconWireframe,
  "illustrated-message": IllustratedMessageWireframe,
  "image-cropper": ImageCropperWireframe,
  image: ImageWireframe,
  "inline-code": InlineCodeWireframe,
  kbd: KbdWireframe,
  label: LabelWireframe,
  "labeled-value": LabeledValueWireframe,
  "layout-card": LayoutCardWireframe,
  "light-box": LightBoxWireframe,
  link: LinkWireframe,
  list: ListWireframe,
  "loading-spinner": LoadingSpinnerWireframe,
  "markdown-editor": MarkdownEditorWireframe,
  markdown: MarkdownWireframe,
  "message-thread": MessageThreadWireframe,
  message: MessageWireframe,
  modal: ModalWireframe,
  navigation: NavigationWireframe,
  notification: NotificationWireframe,
  "notification-provider": NotificationProviderWireframe,
  "number-field": NumberFieldWireframe,
  "password-creation-field": PasswordCreationFieldWireframe,
  "progress-bar": ProgressBarWireframe,
  "radio-group": RadioGroupWireframe,
  rating: RatingWireframe,
  "search-field": SearchFieldWireframe,
  section: SectionWireframe,
  "segmented-control": SegmentedControlWireframe,
  select: SelectWireframe,
  separator: SeparatorWireframe,
  "skeleton-text": SkeletonTextWireframe,
  skeleton: SkeletonWireframe,
  slider: SliderWireframe,
  "submit-button": SubmitButtonWireframe,
  switch: SwitchWireframe,
  "tab-navigation": TabNavigationWireframe,
  table: TableWireframe,
  tabs: TabsWireframe,
  "text-area": TextAreaWireframe,
  "text-field": TextFieldWireframe,
  text: TextWireframe,
  "time-field": TimeFieldWireframe,
  tooltip: TooltipWireframe,
  truncate: TruncateWireframe,
};

export const getWireframe = (slug: string): FC =>
  wireframes[slug] ?? PlaceholderWireframe;
