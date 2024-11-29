import type { FC } from "react";
import React from "react";
import { LayoutCard } from "@/components/LayoutCard";
import styles from "./SecondaryNavigation.module.scss";
import { Navigation, NavigationGroup } from "@/components/Navigation";
import { Link } from "@/components/Link";
import { Text } from "@/components/Text";
import {
  IconApp,
  IconDashboard,
  IconDomain,
} from "@/components/Icon/components/icons";
import { Avatar } from "@/components/Avatar";
import clsx from "clsx";
import { Heading } from "@/components/Heading";
import { Label } from "@/components/Label";
import { dummyText } from "@/lib/dev/dummyText";
import { Image } from "@/components/Image";

export const SecondaryNavigation: FC = () => {
  return (
    <LayoutCard className={clsx(styles.secondaryNavigation)}>
      <Avatar>
        {/* <Initials>Mein Projekt</Initials> */}
        <Image alt="Gopher" src={dummyText.imageSrc} />
      </Avatar>
      <Heading>Mein Projekt</Heading>
      <Navigation>
        <NavigationGroup collapsable>
          <Label>Allgemeines</Label>
          <Link>
            <IconDashboard />
            <Text>Dashboard</Text>
          </Link>
        </NavigationGroup>
        <NavigationGroup collapsable>
          <Label>Komponenten</Label>
          <Link>
            <IconApp />
            <Text>Apps</Text>
          </Link>
          <Link>
            <IconDomain />
            <Text>Domains</Text>
          </Link>
        </NavigationGroup>
      </Navigation>
    </LayoutCard>
  );
};
