"use client";
import type { FC } from "react";
import { HeaderNavigation as HeaderNavigationComponent } from "@mittwald/flow-react-components/HeaderNavigation";
import Button from "@mittwald/flow-react-components/Button";
import {
  IconDashboard,
  IconDomain,
  IconEmail,
  IconInvoice,
  IconLogout,
  IconMember,
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
import { usePathname } from "next/navigation";

interface Props {
  className?: string;
}

export const MobileNavigation: FC<Props> = (props) => {
  const { className } = props;

  const currentPathname = usePathname();

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
                <Link
                  href="/customer/dashboard"
                  aria-current={
                    currentPathname.includes("customer/dashboard")
                      ? "page"
                      : undefined
                  }
                >
                  <IconDashboard />
                  <Text>Dashboard</Text>
                </Link>

                <Link
                  href="/customer/members"
                  aria-current={
                    currentPathname.includes("customer/members")
                      ? "page"
                      : undefined
                  }
                >
                  <IconMember />
                  <Text>Mitglieder</Text>
                </Link>
                <Link
                  href="/customer/invoices"
                  aria-current={
                    currentPathname.includes("customer/invoices")
                      ? "page"
                      : undefined
                  }
                >
                  <IconInvoice />
                  <Text>Rechnungen</Text>
                </Link>
              </NavigationGroup>
              <NavigationGroup>
                <Label>Projekt</Label>
                <Link
                  href="/project/dashboard"
                  aria-current={
                    currentPathname.includes("project/dashboard")
                      ? "page"
                      : undefined
                  }
                >
                  <IconDashboard />
                  <Text>Dashboard</Text>
                </Link>
                <Link
                  href="/project/domains"
                  aria-current={
                    currentPathname.includes("project/domains")
                      ? "page"
                      : undefined
                  }
                >
                  <IconDomain />
                  <Text>Domains</Text>
                </Link>
                <Link
                  href="/project/emails"
                  aria-current={
                    currentPathname.includes("project/emails")
                      ? "page"
                      : undefined
                  }
                >
                  <IconEmail />
                  <Text>E-Mails</Text>
                </Link>
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
