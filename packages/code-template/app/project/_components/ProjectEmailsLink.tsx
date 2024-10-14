import type { FC } from "react";
import { Link } from "@mittwald/flow-react-components/Link";
import { Text } from "@mittwald/flow-react-components/Text";
import { usePathname } from "next/navigation";
import { IconEmail } from "@mittwald/flow-react-components/Icons";

export const ProjectEmailsLink: FC = () => {
  const currentPathname = usePathname();

  return (
    <Link
      href="/project/emails"
      aria-current={
        currentPathname.includes("project/emails") ? "page" : undefined
      }
    >
      <IconEmail />
      <Text>E-Mails</Text>
    </Link>
  );
};
