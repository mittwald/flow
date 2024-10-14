"use client";
import type { FC } from "react";
import Navigation, {
  NavigationGroup,
} from "@mittwald/flow-react-components/Navigation";
import Label from "@mittwald/flow-react-components/Label";
import { NavigationAvatar } from "@/app/_components/NavigationAvatar";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { getCustomer } from "@/api/customerApi";
import { CustomerDashboardLink } from "@/app/customer/_components/CustomerDashboardLink";
import { CustomerMembersLink } from "@/app/customer/_components/CustomerMembersLink";
import { CustomerInvoicesLink } from "@/app/customer/_components/CustomerInvoicesLink";

export const CustomerNavigation: FC = () => {
  const customer = getCustomer();

  return (
    <Navigation>
      <NavigationAvatar>{customer.name}</NavigationAvatar>
      <Heading>{customer.name}</Heading>
      <NavigationGroup>
        <Label>Allgemein</Label>
        <CustomerDashboardLink />
      </NavigationGroup>
      <NavigationGroup>
        <Label>Verwaltung</Label>
        <CustomerMembersLink />
        <CustomerInvoicesLink />
      </NavigationGroup>
    </Navigation>
  );
};
