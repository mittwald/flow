import type { TextProps } from "@/components/Text";
import type { ButtonProps } from "@/components/Button";
import type { IconProps } from "@/components/Icon";
import type { LabelProps } from "@/components/Label";
import type { ContentProps } from "@/components/Content";
import type {
  NavigationItemProps,
  NavigationProps,
} from "@/components/Navigation";
import { FieldErrorProps } from "@/components/FieldError";
import { FieldDescriptionProps } from "@/components/FieldDescription";
import { DatePickerProps, DateRangePickerProps } from "@/components/DatePicker";
import { PopoverProps } from "@/components/Popover";
import { NoteProps } from "@/components/Note";
import { HeadingProps } from "@/components/Heading";
import { InputGroupProps } from "@/components/InputGroup";

export * from "./types";

export interface FlowComponentPropsTypes {
  text: TextProps;
  button: ButtonProps;
  icon: IconProps;
  label: LabelProps;
  content: ContentProps;
  navigation: NavigationProps;
  navigationItem: NavigationItemProps;
  fieldError: FieldErrorProps;
  fieldDescription: FieldDescriptionProps;
  datePicker: DatePickerProps<any>;
  dateRangePicker: DateRangePickerProps<any>;
  popover: PopoverProps;
  heading: HeadingProps;
  note: NoteProps;
  inputGroup: InputGroupProps;
}
