import type { TextProps } from "@/components/Text";
import type { ButtonProps } from "@/components/Button";
import type { IconProps } from "@/components/Icon";
import type { LabelProps } from "@/components/Label";
import { ContentProps } from "@/components/Content";
import { NoteProps } from "@/components/Note";
import { HeadingProps } from "@/components/Heading";

export * from "./types";

export interface FlowComponentPropsTypes {
  text: TextProps;
  button: ButtonProps;
  icon: IconProps;
  label: LabelProps;
  content: ContentProps;
  heading: HeadingProps;
  note: NoteProps;
}
