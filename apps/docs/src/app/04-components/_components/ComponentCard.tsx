"use client";
import type { FC } from "react";
import { Heading, Text } from "@mittwald/flow-react-components";
import type { ComponentLink } from "@/app/04-components/_components/ComponentsList";
import { getWireframe } from "@/app/04-components/_components/wireframe/registry";
import { ComponentStatusBadge } from "@/lib/componentStatus";
import styles from "./ComponentCard.module.scss";

interface Props {
  component: ComponentLink;
}

export const ComponentCard: FC<Props> = (props) => {
  const { component } = props;
  const Wireframe = getWireframe(component.slug);

  return (
    <div className={styles.card}>
      <div className={styles.media} aria-hidden>
        <Wireframe />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <Heading level={3} elementType="p" className={styles.title}>
            {component.name}
          </Heading>
          {component.component && (
            <ComponentStatusBadge name={component.component} />
          )}
        </div>
        {component.description && (
          <Text className={styles.description}>{component.description}</Text>
        )}
      </div>
    </div>
  );
};

export default ComponentCard;
