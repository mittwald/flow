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
  Modal,
  ModalTrigger,
  Section,
} from "@mittwald/flow-react-components";
import type { SerializedMdxFile } from "@/lib/mdx/MdxFile";
import MobileHeaderNavigation from "@/app/_components/layout/MobileHeaderNavigation";

interface Props {
  docs: SerializedMdxFile[];
  className?: string;
}

export const MobileNavigation: FC<Props> = (props) => {
  const { className, docs } = props;

  return (
    <HeaderNavigation className={className}>
      <MobileHeaderNavigation docs={docs} />
      <ModalTrigger>
        <Button variant="plain">
          <IconMenu />
        </Button>
        <Modal offCanvas className={styles.mobileNavigationOffCanvas}>
          <Heading>Menü</Heading>
          <Content>
            <Section>
              <MainNavigation docs={docs} mobileNavigation />
            </Section>
          </Content>
        </Modal>
      </ModalTrigger>
    </HeaderNavigation>
  );
};

export default MobileNavigation;
