"use client";
import type { FC } from "react";
import Link from "@mittwald/flow-react-components/Link";
import Text from "@mittwald/flow-react-components/Text";
import {
  IconDashboard,
  IconInvoice,
  IconMember,
} from "@mittwald/flow-react-components/Icons";
import Navigation from "@mittwald/flow-react-components/Navigation";
import Label from "@mittwald/flow-react-components/Label";
import { usePathname } from "next/navigation";
import { NavigationAvatar } from "@/app/_components/NavigationAvatar";
import { Heading } from "@mittwald/flow-react-components/Heading";

export const CustomerNavigation: FC = () => {
  const currentPathname = usePathname();

  return (
    <Navigation>
      <NavigationAvatar title="Meine Organisation" />
      <Heading>Meine Organisation</Heading>
      <Label>Allgemein</Label>
      <Link
        href="/customer/dashboard"
        aria-current={
          currentPathname.includes("customer/dashboard") ? "page" : undefined
        }
      >
        <IconDashboard />
        <Text>Dashboard</Text>
      </Link>
      <Label>Verwaltung</Label>
      <Link
        href="/customer/members"
        aria-current={
          currentPathname.includes("customer/members") ? "page" : undefined
        }
      >
        <IconMember />
        <Text>Mitglieder</Text>
      </Link>
      <Link
        href="/customer/invoices"
        aria-current={
          currentPathname.includes("customer/invoices") ? "page" : undefined
        }
      >
        <IconInvoice />
        <Text>Rechnungen</Text>
      </Link>
    </Navigation>
  );
};
