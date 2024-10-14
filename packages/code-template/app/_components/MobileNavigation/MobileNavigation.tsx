"use client";
import type { FC } from "react";
import { HeaderNavigation as HeaderNavigationComponent } from "@mittwald/flow-react-components/HeaderNavigation";
import Button from "@mittwald/flow-react-components/Button";
import {
  IconLogout,
  IconMenu,
  IconNotification,
} from "@mittwald/flow-react-components/Icons";
import Tooltip, {
  TooltipTrigger,
} from "@mittwald/flow-react-components/Tooltip";
import CounterBadge from "@mittwald/flow-react-components/CounterBadge";
import styles from "./MobileNavigation.module.scss";
import { Modal, ModalTrigger } from "@mittwald/flow-react-components/Modal";
import { NotificationModal } from "@/app/_components/NotificationModal";
import {
  Navigation,
  NavigationGroup,
} from "@mittwald/flow-react-components/Navigation";
import { Label } from "@mittwald/flow-react-components/Label";
import { Content } from "@mittwald/flow-react-components/Content";
import { Text } from "@mittwald/flow-react-components/Text";
import { Heading } from "@mittwald/flow-react-components/Heading";
import Link from "@mittwald/flow-react-components/Link";
import { CustomerDashboardLink } from "@/app/customer/_components/CustomerDashboardLink";
import { CustomerMembersLink } from "@/app/customer/_components/CustomerMembersLink";
import { CustomerInvoicesLink } from "@/app/customer/_components/CustomerInvoicesLink";
import { ProjectDashboardLink } from "@/app/project/_components/ProjectDashboardLink";
import { ProjectDomainsLink } from "@/app/project/_components/ProjectDomainsLink";
import { ProjectEmailsLink } from "@/app/project/_components/ProjectEmailsLink";

interface Props {
  className?: string;
}

export const MobileNavigation: FC<Props> = (props) => {
  const { className } = props;

  return (
    <HeaderNavigationComponent
      className={className}
      aria-label="Header navigation"
      color="light"
    >
      <ModalTrigger>
        <TooltipTrigger>
          <Button aria-label="Benachrichtigungen">
            <IconNotification />
            <CounterBadge count={3} className={styles.counterBadge} />
          </Button>
          <Tooltip>Benachrichtigungen</Tooltip>
        </TooltipTrigger>
        <NotificationModal />
      </ModalTrigger>
      <ModalTrigger>
        <Button aria-label="Menü">
          <IconMenu />
        </Button>
        <Modal offCanvas>
          <Heading>Menü</Heading>
          <Content>
            <Navigation>
              <NavigationGroup>
                <Label>Organisation</Label>
                <CustomerDashboardLink />
                <CustomerMembersLink />
                <CustomerInvoicesLink />
              </NavigationGroup>
              <NavigationGroup>
                <Label>Projekt</Label>
                <ProjectDashboardLink />
                <ProjectDomainsLink />
                <ProjectEmailsLink />
              </NavigationGroup>
              <NavigationGroup>
                <Label>User Settings</Label>
                <Link>
                  <IconLogout />
                  <Text>Logout</Text>
                </Link>
              </NavigationGroup>
            </Navigation>
          </Content>
        </Modal>
      </ModalTrigger>
    </HeaderNavigationComponent>
  );
};
