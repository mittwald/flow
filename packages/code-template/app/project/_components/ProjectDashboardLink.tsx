import type { FC } from "react";
import { Link } from "@mittwald/flow-react-components/Link";
import { Text } from "@mittwald/flow-react-components/Text";
import { usePathname } from "next/navigation";
import { IconDashboard } from "@mittwald/flow-react-components/Icons";

export const ProjectDashboardLink: FC = () => {
  const currentPathname = usePathname();

  return (
    <Link
      href="/project/dashboard"
      aria-current={
        currentPathname.includes("project/dashboard") ? "page" : undefined
      }
    >
      <IconDashboard />
      <Text>Dashboard</Text>
    </Link>
  );
};
