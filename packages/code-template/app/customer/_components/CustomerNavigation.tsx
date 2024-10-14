"use client";
import type { FC } from "react";
import Link from "@mittwald/flow-react-components/Link";
import Text from "@mittwald/flow-react-components/Text";
import {
  IconDashboard,
  IconInvoice,
  IconMember,
} from "@mittwald/flow-react-components/Icons";
import Navigation, {
  NavigationGroup,
} from "@mittwald/flow-react-components/Navigation";
import Label from "@mittwald/flow-react-components/Label";
import { usePathname } from "next/navigation";
import { NavigationAvatar } from "@/app/_components/NavigationAvatar";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { getCustomer } from "@/api/customerApi";

export const CustomerNavigation: FC = () => {
  const currentPathname = usePathname();
  const customer = getCustomer();

  return (
    <Navigation>
      <NavigationAvatar>{customer.name}</NavigationAvatar>
      <Heading>{customer.name}</Heading>
      <NavigationGroup>
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
      </NavigationGroup>
      <NavigationGroup>
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
      </NavigationGroup>
    </Navigation>
  );
};
