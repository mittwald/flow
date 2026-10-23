"use client";
import {
  Header,
  Heading,
  Section,
  SkeletonMode,
  Switch,
} from "@mittwald/flow-remote-react-components";
import { type PropsWithChildren, useState } from "react";

interface Props extends PropsWithChildren {
  title: string;
}

/**
 * Frame of a component group page: one example per component of the group, as
 * the docs group them. The switch puts the whole page into skeleton mode, so
 * every component's skeleton is also checked over the iframe connection.
 */
export const ComponentGroupPage = (props: Props) => {
  const [isSkeleton, setIsSkeleton] = useState(false);

  return (
    <Section>
      <Header>
        <Heading>{props.title}</Heading>
        <Switch isSelected={isSkeleton} onChange={setIsSkeleton}>
          Skeleton mode
        </Switch>
      </Header>
      <SkeletonMode isEnabled={isSkeleton}>{props.children}</SkeletonMode>
    </Section>
  );
};
