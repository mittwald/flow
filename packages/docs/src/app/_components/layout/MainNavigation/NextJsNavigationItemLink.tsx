import React, { ComponentProps, forwardRef } from "react";
import Link from "next/link";

export const NextJsNavigationItemLink = forwardRef<
  HTMLAnchorElement,
  Omit<ComponentProps<"a">, "ref">
>(function NavigationItemLink(props, ref) {
  return <Link href={props.href ?? "/"} {...props} ref={ref} />;
});
