"use client";
import type { FC } from "react";
import Link from "@mittwald/flow-react-components/Link";
import Text from "@mittwald/flow-react-components/Text";
import {
  IconDashboard,
  IconDomain,
  IconEmail,
} from "@mittwald/flow-react-components/Icons";
import Navigation from "@mittwald/flow-react-components/Navigation";
import Label from "@mittwald/flow-react-components/Label";
import { usePathname } from "next/navigation";

import { NavigationAvatar } from "@/app/_components/NavigationAvatar";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { getProject } from "@/api/projectApi";

export const ProjectNavigation: FC = () => {
  const currentPathname = usePathname();
  const project = getProject();

  return (
    <Navigation>
      <NavigationAvatar>{project.name}</NavigationAvatar>
      <Heading>{project.name}</Heading>
      <Label>Allgemein</Label>
      <Link
        href="/project/dashboard"
        aria-current={
          currentPathname.includes("project/dashboard") ? "page" : undefined
        }
      >
        <IconDashboard />
        <Text>Dashboard</Text>
      </Link>
      <Label>Komponenten</Label>
      <Link
        href="/project/domains"
        aria-current={
          currentPathname.includes("project/domains") ? "page" : undefined
        }
      >
        <IconDomain />
        <Text>Domains</Text>
      </Link>
      <Link
        href="/project/emails"
        aria-current={
          currentPathname.includes("project/emails") ? "page" : undefined
        }
      >
        <IconEmail />
        <Text>E-Mails</Text>
      </Link>
    </Navigation>
  );
};
