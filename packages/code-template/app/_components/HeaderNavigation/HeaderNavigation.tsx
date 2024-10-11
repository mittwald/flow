"use client";
import type { FC } from "react";
import { HeaderNavigation as HeaderNavigationComponent } from "@mittwald/flow-react-components/HeaderNavigation";
import Button from "@mittwald/flow-react-components/Button";
import Avatar from "@mittwald/flow-react-components/Avatar";
import Initials from "@mittwald/flow-react-components/Initials";
import Link from "@mittwald/flow-react-components/Link";
import { usePathname } from "next/navigation";
import ContextMenu, {
  ContextMenuTrigger,
  MenuItem,
} from "@mittwald/flow-react-components/ContextMenu";
import {
  IconLogout,
  IconNotification,
} from "@mittwald/flow-react-components/Icons";
import Text from "@mittwald/flow-react-components/Text";
import Tooltip, {
  TooltipTrigger,
} from "@mittwald/flow-react-components/Tooltip";
import CounterBadge from "@mittwald/flow-react-components/CounterBadge";
import styles from "./HeaderNavigation.module.scss";
import { ModalTrigger } from "@mittwald/flow-react-components/Modal";
import { NotificationModal } from "@/app/_components/NotificationModal";
import { getUser } from "@/api/userApi";

export const HeaderNavigation: FC = () => {
  const currentPathname = usePathname();
  const user = getUser("1");

  return (
    <HeaderNavigationComponent aria-label="Header navigation" color="light">
      <Link
        href="/customer"
        aria-current={currentPathname.includes("customer") ? "page" : undefined}
      >
        Organisation
      </Link>
      <Link
        href="/project"
        aria-current={currentPathname.includes("project") ? "page" : undefined}
      >
        Projekt
      </Link>
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
      <ContextMenuTrigger>
        <TooltipTrigger>
          <Button aria-label="User Settings">
            <Avatar color="teal">
              <Initials>{user.name}</Initials>
            </Avatar>
          </Button>
          <Tooltip>User Settings</Tooltip>
        </TooltipTrigger>
        <ContextMenu>
          <MenuItem>
            <IconLogout />
            <Text>Logout</Text>
          </MenuItem>
        </ContextMenu>
      </ContextMenuTrigger>
    </HeaderNavigationComponent>
  );
};
