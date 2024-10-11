"use client";
import type { FC } from "react";
import { HeaderNavigation as HeaderNavigationComponent } from "@mittwald/flow-react-components/HeaderNavigation";
import Button from "@mittwald/flow-react-components/Button";
import {
  IconMenu,
  IconNotification,
} from "@mittwald/flow-react-components/Icons";
import Tooltip, {
  TooltipTrigger,
} from "@mittwald/flow-react-components/Tooltip";
import CounterBadge from "@mittwald/flow-react-components/CounterBadge";
import styles from "./MobileNavigation.module.scss";
import { ModalTrigger } from "@mittwald/flow-react-components/Modal";
import { NotificationModal } from "@/app/_components/NotificationModal";

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
      <Button aria-label="Menü">
        <IconMenu />
      </Button>
    </HeaderNavigationComponent>
  );
};
