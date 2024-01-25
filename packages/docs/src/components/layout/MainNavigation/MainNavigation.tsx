"use client";
import React, { FC, useId } from "react";
import Navigation, {
  NavigationItem,
} from "@mittwald/flow-next-components/Navigation";
import Heading from "@mittwald/flow-next-components/Heading";

const MainNavigation: FC = () => {
  const headingComponentsId = useId();

  return (
    <>
      <Heading level={3} id={headingComponentsId}>
        Components
      </Heading>
      <Navigation aria-labelledby={headingComponentsId}>
        <NavigationItem href="/components/button">Button</NavigationItem>
      </Navigation>
    </>
  );
};

export default MainNavigation;
