import type { ComponentProps } from "react";
import React, { forwardRef } from "react";
import NextLink from "next/link";

export interface LinkProps extends Omit<ComponentProps<"a">, "ref"> {
  onPress?: () => object;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(props, ref) {
    const { href, onPress, onClick, ...rest } = props;

    if (!onPress && !onClick && !href) {
      return <span {...rest} ref={ref} />;
    }

    return (
      <NextLink
        href={href ?? "#"}
        onClick={onPress ?? onClick}
        {...rest}
        ref={ref}
      />
    );
  },
);
