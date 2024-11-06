import type { ComponentProps } from "react";
import React, { forwardRef } from "react";
import NextLink from "next/link";

interface Props extends Omit<ComponentProps<"a">, "ref"> {
  isDisabled: boolean;
}

export const Link = forwardRef<HTMLAnchorElement, Props>(
  function Link(props, ref) {
    const { href, isDisabled, ...rest } = props;

    return (
      <NextLink
        href={href ?? "#"}
        aria-disabled={isDisabled}
        {...rest}
        ref={ref}
      />
    );
  },
);
