import type { FC } from "react";
import React from "react";
import { LayoutCard } from "@/components/LayoutCard";
import styles from "./PrimaryNavigation.module.scss";
import { Navigation, NavigationGroup } from "@/components/Navigation";
import { Link } from "@/components/Link";
import { Text } from "@/components/Text";
import {
  IconDashboard,
  IconProject,
  IconSupport,
} from "@/components/Icon/components/icons";
import { Separator } from "@/components/Separator";
import { Avatar } from "@/components/Avatar";
import { Initials } from "@/components/Initials";
import clsx from "clsx";
import { dummyText } from "@/lib/dev/dummyText";
import { Image } from "@/components/Image";

interface Props {
  collapsed?: boolean;
}

export const PrimaryNavigation: FC<Props> = (props) => {
  return (
    <LayoutCard
      className={clsx(
        styles.primaryNavigation,
        props.collapsed && styles.collapsed,
      )}
    >
      <Navigation>
        <NavigationGroup>
          <Link>
            <IconDashboard />
            <Text>Dashboard</Text>
          </Link>
          <Link>
            <IconProject />
            <Text>Projekte</Text>
          </Link>
        </NavigationGroup>
        <Separator />
        <NavigationGroup>
          <Link>
            <Avatar>
              <Initials>Mein Projekt</Initials>
            </Avatar>
            <Text>Mein Projekt</Text>
          </Link>
          <Link>
            <Avatar>
              <Image alt="Gopher" src={dummyText.imageSrc} />
            </Avatar>
            <Text>Gophers Projekt</Text>
          </Link>
        </NavigationGroup>
        <Separator />
        <NavigationGroup>
          <Link>
            <IconSupport />
            <Text>Support</Text>
          </Link>
        </NavigationGroup>
      </Navigation>
    </LayoutCard>
  );
};
