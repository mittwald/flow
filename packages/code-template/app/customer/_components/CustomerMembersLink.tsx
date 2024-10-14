import type { FC } from "react";
import { Link } from "@mittwald/flow-react-components/Link";
import { Text } from "@mittwald/flow-react-components/Text";
import { usePathname } from "next/navigation";
import { IconMember } from "@mittwald/flow-react-components/Icons";

export const CustomerMembersLink: FC = () => {
  const currentPathname = usePathname();

  return (
    <Link
      href="/customer/members"
      aria-current={
        currentPathname.includes("customer/members") ? "page" : undefined
      }
    >
      <IconMember />
      <Text>Mitglieder</Text>
    </Link>
  );
};
