"use client";

import React, { FC } from "react";
import type { UseServerGetComponentModules } from "@/components/Navigation/lib/useServerGetComponentModules";
import {
  Navigation as ComponentNavigation,
  NavigationItem,
} from "@mittwald/flow-components/Navigation";
import { usePathname } from "next/navigation";

export interface NavigationProps {
  className: string;
  modules: UseServerGetComponentModules;
}

const Navigation: FC<NavigationProps> = (props) => {
  const { modules, className } = props;
  const pathname = usePathname();

  const navigationItems = modules.map((m) => {
    return (
      <NavigationItem
        key={m.pathName}
        href={m.pathName}
        isCurrent={pathname === m.pathName}
      >
        {m.name}
      </NavigationItem>
    );
  });

  return (
    <ComponentNavigation className={className}>
      {navigationItems}
    </ComponentNavigation>
  );
};

export default Navigation;
