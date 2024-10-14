import type { FC } from "react";
import { Link } from "@mittwald/flow-react-components/Link";
import { Text } from "@mittwald/flow-react-components/Text";
import { usePathname } from "next/navigation";
import { IconInvoice } from "@mittwald/flow-react-components/Icons";

export const CustomerInvoicesLink: FC = () => {
  const currentPathname = usePathname();

  return (
    <Link
      href="/customer/invoices"
      aria-current={
        currentPathname.includes("customer/invoices") ? "page" : undefined
      }
    >
      <IconInvoice />
      <Text>Rechnungen</Text>
    </Link>
  );
};
