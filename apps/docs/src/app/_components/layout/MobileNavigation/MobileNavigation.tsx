import type { FC } from "react";
import React from "react";
import styles from "@/app/layout.module.scss";
import MainNavigation from "@/app/_components/layout/MainNavigation";
import { IconMenu } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";
import type { SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { HeaderNavigation as HeaderNavigationComponent } from "@mittwald/flow-react-components";
import HeaderNavigation from "@/app/_components/layout/HeaderNavigation";
import { Section } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { Content } from "@mittwald/flow-react-components";
import { Modal, ModalTrigger } from "@mittwald/flow-react-components";

interface Props {
  docs: SerializedMdxFile[];
  className?: string;
}

export const MobileNavigation: FC<Props> = (props) => {
  const { className, docs } = props;

  return (
    <HeaderNavigationComponent className={className}>
      <Content>
        <ModalTrigger>
          <Button color="secondary" variant="plain">
            <IconMenu />
          </Button>
          <Modal offCanvas className={styles.mobileNavigationOffCanvas}>
            <Heading>Menü</Heading>
            <Content>
              <Section>
                <HeaderNavigation docs={docs} />
                <MainNavigation docs={docs} mobileNavigation />
              </Section>
            </Content>
          </Modal>
        </ModalTrigger>
      </Content>
    </HeaderNavigationComponent>
  );
};

export default MobileNavigation;
