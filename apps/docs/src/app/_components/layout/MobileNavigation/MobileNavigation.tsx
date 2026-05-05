import type { FC } from "react";
import React from "react";
import styles from "@/app/layout.module.scss";
import MainNavigation from "@/app/_components/layout/MainNavigation";
import {
  Button,
  Content,
  HeaderNavigation,
  Heading,
  IconMenu,
  Link,
  Modal,
  ModalTrigger,
  Navigation,
  Section,
} from "@mittwald/flow-react-components";
import { MdxFile, type SerializedMdxFile } from "@/lib/mdx/MdxFile";
import MobileHeaderNavigation from "@/app/_components/layout/MobileHeaderNavigation";
import { GroupText } from "@/app/_components/layout/MainNavigation/components/GroupText";
import { groupBy } from "remeda";
import { usePathname } from "next/navigation";

interface Props {
  docs: SerializedMdxFile[];
  className?: string;
}

export const MobileNavigation: FC<Props> = (props) => {
  const { className } = props;

  const docs = props.docs.map(MdxFile.deserialize);

  const navGroups = groupBy(docs, (d) => d.pathname.split("/")[1]);

  const currentPathname = usePathname();

  const mainItems = Object.entries(navGroups).map(([group, mdxFiles]) => {
    const pathname = mdxFiles[0].pathname;
    const isComponent = pathname.includes("04-components");

    return (
      <Link
        href={`${pathname}${isComponent ? "/overview" : ""}`}
        key={pathname}
      >
        <GroupText>{group}</GroupText>
      </Link>
    );
  });

  const currentGroup = Object.entries(navGroups).find(([group]) => {
    return currentPathname.includes(group);
  })?.[0];

  return (
    <HeaderNavigation className={className}>
      <MobileHeaderNavigation docs={props.docs} />
      <ModalTrigger>
        <Button variant="plain">
          <IconMenu />
        </Button>
        <Modal offCanvas className={styles.mobileNavigationOffCanvas}>
          <Heading>Menü</Heading>
          <Content>
            <Section>
              {!currentGroup && <Navigation>{mainItems}</Navigation>}
              <MainNavigation docs={props.docs} mobileNavigation />
            </Section>
          </Content>
        </Modal>
      </ModalTrigger>
    </HeaderNavigation>
  );
};

export default MobileNavigation;
