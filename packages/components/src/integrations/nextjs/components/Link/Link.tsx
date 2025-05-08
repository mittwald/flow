import type { ComponentProps, FC, Ref } from "react";
import NextLink from "next/link";

interface Props extends Omit<ComponentProps<"a">, "ref"> {
  ref?: Ref<HTMLAnchorElement>;
  isDisabled?: boolean;
}

/** @deprecated Use RouterProvider instead */
export const Link: FC<Props> = (props) => {
  const { href, isDisabled, ...rest } = props;

  return <NextLink href={href ?? "#"} aria-disabled={isDisabled} {...rest} />;
};
