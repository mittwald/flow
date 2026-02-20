"use client";
import { Link, type LinkProps } from "@mittwald/flow-react-components";
import type { FC } from "react";
import { usePathname } from "next/navigation";

interface Props extends LinkProps {
  page: string;
}

export const NavigationItem: FC<Props> = (props) => {
  const { children, page, ...rest } = props;

  const currentPathname = usePathname();

  return (
    <Link
      {...rest}
      href={`/host/${page}`}
      aria-current={
        currentPathname.includes(`/host/${page}`) ? "page" : undefined
      }
    >
      {children}
    </Link>
  );
};
