import type { FC } from "react";
import React from "react";
import styles from "@/app/layout.module.scss";
import MainNavigation from "@/app/_components/layout/MainNavigation";
import { IconMenu } from "@mittwald/flow-react-components/Icons";
import {
  OffCanvas,
  OffCanvasTrigger,
} from "@mittwald/flow-react-components/OffCanvas";
import { Button } from "@mittwald/flow-react-components/Button";
import type { SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { HeaderNavigation as HeaderNavigationComponent } from "@mittwald/flow-react-components/HeaderNavigation";
import HeaderNavigation from "@/app/_components/layout/HeaderNavigation";
import { Section } from "@mittwald/flow-react-components/Section";
import { Heading } from "@mittwald/flow-react-components/Heading";

interface Props {
  docs: SerializedMdxFile[];
  className?: string;
}

export const MobileNavigation: FC<Props> = (props) => {
  const { className, docs } = props;

  return (
    <HeaderNavigationComponent className={className}>
      <OffCanvasTrigger>
        <Button color="secondary" variant="plain">
          <IconMenu />
        </Button>
        <OffCanvas className={styles.mobileNavigationOffCanvas}>
          <Heading>Menü</Heading>
          <Section>
            <HeaderNavigation docs={docs} />
            <MainNavigation docs={docs} />
          </Section>
        </OffCanvas>
      </OffCanvasTrigger>
    </HeaderNavigationComponent>
  );
};

export default MobileNavigation;
