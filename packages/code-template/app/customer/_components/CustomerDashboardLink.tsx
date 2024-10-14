import type { FC } from "react";
import { Link } from "@mittwald/flow-react-components/Link";
import { Text } from "@mittwald/flow-react-components/Text";
import { usePathname } from "next/navigation";
import { IconDashboard } from "@mittwald/flow-react-components/Icons";

export const CustomerDashboardLink: FC = () => {
  const currentPathname = usePathname();

  return (
    <Link
      href="/customer/dashboard"
      aria-current={
        currentPathname.includes("customer/dashboard") ? "page" : undefined
      }
    >
      <IconDashboard />
      <Text>Dashboard</Text>
    </Link>
  );
};
