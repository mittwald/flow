import type { FC } from "react";
import React from "react";
import styles from "@/app/layout.module.scss";
import MainNavigation from "@/app/_components/layout/MainNavigation";
import {
  ActionGroup,
  Button,
  Content,
  HeaderNavigation,
  Heading,
  IconMenu,
  Modal,
  ModalTrigger,
  Navigation,
  Section,
} from "@mittwald/flow-react-components";
import { MdxFile, type SerializedMdxFile } from "@/lib/mdx/MdxFile";
import MobileHeaderNavigation from "@/app/_components/layout/MobileHeaderNavigation";
import { groupBy } from "remeda";
import { usePathname } from "next/navigation";
import { ThemeSwitcherButton } from "@/app/_components/layout/HeaderNavigation/components/ThemeSwitcherButton";
import Groups from "@/app/_components/layout/Groups";

interface Props {
  docs: SerializedMdxFile[];
  className?: string;
}

export const MobileNavigation: FC<Props> = (props) => {
  const { className } = props;

  const docs = props.docs.map(MdxFile.deserialize);

  const navGroups = groupBy(docs, (d) => d.pathname.split("/")[1]);

  const currentPathname = usePathname();

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
              {!currentGroup && (
                <Navigation>
                  <Groups docs={props.docs} />
                </Navigation>
              )}
              <MainNavigation docs={props.docs} mobileNavigation />
            </Section>
          </Content>
          <ActionGroup>
            <ThemeSwitcherButton />
          </ActionGroup>
        </Modal>
      </ModalTrigger>
    </HeaderNavigation>
  );
};

export default MobileNavigation;
