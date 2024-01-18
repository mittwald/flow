import type { TextProps } from "@/components/Text";
import type { ButtonProps } from "@/components/Button";
import type { IconProps } from "@/components/Icon";
import type { LabelProps } from "@/components/Label";
import type { ContentProps } from "@/components/Content";
import type {
  NavigationItemProps,
  NavigationProps,
} from "@/components/Navigation";
import type { LinkProps } from "@/components/Link";
import { FieldErrorProps } from "@/components/FieldError";
import { FieldDescriptionProps } from "@/components/FieldDescription";
import { NoteProps } from "@/components/Note";
import { HeadingProps } from "@/components/Heading";
import { InitialsProps } from "@/components/Initials";
import { ImageProps } from "@/components/Image";
import { DatePickerProps, DateRangePickerProps } from "@/components/DatePicker";

export * from "./types";

export interface FlowComponentPropsTypes {
  Text: TextProps;
  Button: ButtonProps;
  Icon: IconProps;
  Label: LabelProps;
  Content: ContentProps;
  Navigation: NavigationProps;
  NavigationItem: NavigationItemProps;
  Heading: HeadingProps;
  Note: NoteProps;
  Link: LinkProps;
  Initials: InitialsProps;
  Image: ImageProps;
  FieldError: FieldErrorProps;
  FieldDescription: FieldDescriptionProps;
  datePicker: DatePickerProps<any>;
  dateRangePicker: DateRangePickerProps<any>;

}
