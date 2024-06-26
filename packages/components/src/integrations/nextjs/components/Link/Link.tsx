import type { ComponentProps } from "react";
import React, { forwardRef } from "react";
import NextLink from "next/link";

export const Link = forwardRef<
  HTMLAnchorElement,
  Omit<ComponentProps<"a">, "ref">
>(function Link(props, ref) {
  const { href, ...rest } = props;

  return <NextLink href={href ?? "#"} {...rest} ref={ref} />;
});
