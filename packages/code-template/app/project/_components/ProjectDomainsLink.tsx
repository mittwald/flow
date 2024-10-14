import type { FC } from "react";
import { Link } from "@mittwald/flow-react-components/Link";
import { Text } from "@mittwald/flow-react-components/Text";
import { usePathname } from "next/navigation";
import { IconDomain } from "@mittwald/flow-react-components/Icons";

export const ProjectDomainsLink: FC = () => {
  const currentPathname = usePathname();

  return (
    <Link
      href="/project/domains"
      aria-current={
        currentPathname.includes("project/domains") ? "page" : undefined
      }
    >
      <IconDomain />
      <Text>Domains</Text>
    </Link>
  );
};
