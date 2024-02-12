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
import type { FieldErrorProps } from "@/components/FieldError";
import type { FieldDescriptionProps } from "@/components/FieldDescription";
import type { NoteProps } from "@/components/Note";
import type { HeadingProps } from "@/components/Heading";
import type { InitialsProps } from "@/components/Initials";
import type { ImageProps } from "@/components/Image";
import type { CopyToClipboardButtonProps } from "@/components/CopyToClipboardButton";
import type { SkeletonProps } from "@/components/Skeleton/Skeleton";

export * from "./types";

export interface FlowComponentPropsTypes {
  Text: TextProps;
  Button: ButtonProps;
  CopyToClipboard: CopyToClipboardButtonProps;
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
  Skeleton: SkeletonProps;
}
