"use client";

import React from "react";
import {
  Icon,
  AlertIcon,
  Section,
  Heading,
} from "@mittwald/flow-remote-react-components";
// import { IconCircleCheck } from "@tabler/icons-react";

const svgString = `\
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" />
</svg>`;

// const svgElement = (
//   <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
//     <circle cx="50" cy="50" r="50" />
//   </svg>
// );

export default function Page() {
  return (
    <Section>
      <Heading level={4}>Icon component</Heading>
      <AlertIcon status="success" />

      {/*<Heading level={4}>Tabler icon</Heading>*/}
      {/*<Icon>*/}
      {/*  <IconCircleCheck />*/}
      {/*</Icon>*/}

      {/*<Heading level={4}>SVG element</Heading>*/}
      {/*<Icon>{svgElement}</Icon>*/}

      <Heading level={4}>SVG-String</Heading>
      <Icon>{svgString}</Icon>
    </Section>
  );
}
