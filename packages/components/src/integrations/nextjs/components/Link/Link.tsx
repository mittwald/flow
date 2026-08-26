import type { ComponentProps, FC, Ref } from "react";
import NextLink from "next/link";
import { useWarnDeprecation } from "@/components/DeprecationWarningProvider";

interface Props extends Omit<ComponentProps<"a">, "ref"> {
  ref?: Ref<HTMLAnchorElement>;
  isDisabled?: boolean;
}

/** @deprecated Use RouterProvider instead */
export const Link: FC<Props> = (props) => {
  const { href, isDisabled, ...rest } = props;

  const warnDeprecation = useWarnDeprecation();
  warnDeprecation(
    "The 'Link' component is deprecated and will be removed in a future release. Use 'RouterProvider' instead.",
  );

  return <NextLink href={href ?? "#"} aria-disabled={isDisabled} {...rest} />;
};
