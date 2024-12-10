import type { ComponentProps } from "react";
import React, { forwardRef } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

interface Props extends Omit<ComponentProps<"a">, "ref"> {
  isDisabled?: boolean;
}

export const Link = forwardRef<HTMLAnchorElement, Props>(
  function Link(props, ref) {
    const { href = "#", isDisabled, ...rest } = props;
    const currentPathname = usePathname();

    const currentProps = currentPathname.startsWith(href)
      ? {
          "aria-current": true,
        }
      : {};

    return (
      <NextLink
        href={href}
        aria-disabled={isDisabled}
        {...currentProps}
        {...rest}
        ref={ref}
      />
    );
  },
);
