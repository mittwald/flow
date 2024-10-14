"use client";
import type { FC } from "react";
import Navigation, {
  NavigationGroup,
} from "@mittwald/flow-react-components/Navigation";
import Label from "@mittwald/flow-react-components/Label";
import { NavigationAvatar } from "@/app/_components/NavigationAvatar";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { getProject } from "@/api/projectApi";
import { ProjectDashboardLink } from "@/app/project/_components/ProjectDashboardLink";
import { ProjectDomainsLink } from "@/app/project/_components/ProjectDomainsLink";
import { ProjectEmailsLink } from "@/app/project/_components/ProjectEmailsLink";

export const ProjectNavigation: FC = () => {
  const project = getProject();

  return (
    <Navigation>
      <NavigationAvatar>{project.name}</NavigationAvatar>
      <Heading>{project.name}</Heading>
      <NavigationGroup>
        <Label>Allgemein</Label>
        <ProjectDashboardLink />
      </NavigationGroup>
      <NavigationGroup>
        <Label>Komponenten</Label>
        <ProjectDomainsLink />
        <ProjectEmailsLink />
      </NavigationGroup>
    </Navigation>
  );
};
