import type { ComponentProps } from "react";
import React, { forwardRef } from "react";
import NextLink from "next/link";

export interface LinkProps extends Omit<ComponentProps<"a">, "ref"> {
  onPress?: () => object;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(props, ref) {
    const { href, onPress, ...rest } = props;

    return (
      <NextLink href={href ?? "#"} onClick={onPress} {...rest} ref={ref} />
    );
  },
);
