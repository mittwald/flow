import type { TextProps } from "@/components/Text";
import type { ButtonProps } from "@/components/Button";
import type { IconProps } from "@/components/Icon";
import type { LabelProps } from "@/components/Label";
import type { ContentProps } from "@/components/Content";
import type {
  NavigationItemProps,
  NavigationProps,
} from "@/components/Navigation";
import { NoteProps } from "@/components/Note";
import { HeadingProps } from "@/components/Heading";

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
}
