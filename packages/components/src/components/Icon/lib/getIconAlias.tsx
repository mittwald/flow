import {
  IconAdjustmentsHorizontal,
  IconAlertCircle,
  IconAlertTriangle,
  IconAppWindow,
  IconArchive,
  IconArrowLeft,
  IconBell,
  IconBuilding,
  IconCalendar,
  IconCalendarCheck,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconCircleCheck,
  IconClock,
  IconCopy,
  IconDatabase,
  IconDice3,
  IconDoor,
  IconExternalLink,
  IconEye,
  IconEyeCancel,
  IconFileX,
  IconFilter,
  IconHeadset,
  IconHome,
  IconInfoCircle,
  IconLayoutBoard,
  IconLayoutGrid,
  IconList,
  IconListSearch,
  IconLoader2,
  IconMail,
  IconMinus,
  IconPlus,
  IconPower,
  IconSearch,
  IconServer,
  IconSettings,
  IconTrash,
  IconUsersGroup,
  IconWorld,
  IconX,
} from "@tabler/icons-react";
import React, { ReactElement } from "react";

type DescriptiveIconAliases =
  | "project"
  | "server"
  | "customer"
  | "support"
  | "email"
  | "app"
  | "domain"
  | "database"
  | "backup"
  | "cronjob"
  | "member"
  | "settings"
  | "searchEngine"
  | "sshSftp";

type FunctionalIconAliases =
  | "home"
  | "notification"
  | "dashboard"
  | "logout"
  | "search"
  | "tileView"
  | "listView"
  | "filter"
  | "sorting"
  | "delete"
  | "terminate"
  | "copy"
  | "backLink"
  | "externalLink"
  | "chevronLeft"
  | "chevronRight"
  | "chevronUp"
  | "chevronDown"
  | "close"
  | "show"
  | "hide"
  | "random"
  | "date"
  | "time"
  | "plus"
  | "minus";

type StatusIconAliases =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "pending"
  | "succeeded"
  | "failed";

export type IconAliases =
  | DescriptiveIconAliases
  | FunctionalIconAliases
  | StatusIconAliases;

export const getIconByAlias = (iconAlias: IconAliases): ReactElement => {
  switch (iconAlias) {
    case "project":
      return <IconArchive />;
    case "server":
      return <IconServer />;
    case "customer":
      return <IconBuilding />;
    case "support":
      return <IconHeadset />;
    case "email":
      return <IconMail />;
    case "app":
      return <IconAppWindow />;
    case "domain":
      return <IconWorld />;
    case "database":
      return <IconDatabase />;
    case "backup":
      return <IconClock />;
    case "cronjob":
      return <IconCalendarCheck />;
    case "member":
      return <IconUsersGroup />;
    case "settings":
      return <IconSettings />;
    case "searchEngine":
      return <IconListSearch />;
    case "sshSftp":
      return <IconDoor />;
    case "home":
      return <IconHome />;
    case "notification":
      return <IconBell />;
    case "dashboard":
      return <IconLayoutBoard />;
    case "logout":
      return <IconPower />;
    case "search":
      return <IconSearch />;
    case "tileView":
      return <IconLayoutGrid />;
    case "listView":
      return <IconList />;
    case "filter":
      return <IconFilter />;
    case "sorting":
      return <IconAdjustmentsHorizontal />;
    case "delete":
      return <IconTrash />;
    case "terminate":
      return <IconFileX />;
    case "copy":
      return <IconCopy />;
    case "backLink":
      return <IconArrowLeft />;
    case "externalLink":
      return <IconExternalLink />;
    case "chevronLeft":
      return <IconChevronLeft />;
    case "chevronRight":
      return <IconChevronRight />;
    case "chevronUp":
      return <IconChevronUp />;
    case "chevronDown":
      return <IconChevronDown />;
    case "close":
      return <IconX />;
    case "show":
      return <IconEye />;
    case "hide":
      return <IconEyeCancel />;
    case "random":
      return <IconDice3 />;
    case "date":
      return <IconCalendar />;
    case "time":
      return <IconClock />;
    case "plus":
      return <IconPlus />;
    case "minus":
      return <IconMinus />;
    case "success":
      return <IconCircleCheck />;
    case "warning":
      return <IconAlertCircle />;
    case "danger":
      return <IconAlertTriangle />;
    case "info":
      return <IconInfoCircle />;
    case "pending":
      return <IconLoader2 />;
    case "succeeded":
      return <IconCheck />;
    case "failed":
      return <IconX />;
    default:
      return <IconInfoCircle />;
  }
};
