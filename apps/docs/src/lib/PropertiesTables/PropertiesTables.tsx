"use client";
import { PropertiesTable } from "@/lib/PropertiesTables/components/PropertiesTable";
import {
  Accordion,
  Content,
  Heading,
  useIsMounted,
} from "@mittwald/flow-react-components";
import React from "react";
import loadProperties from "./lib/loadProperties";

interface PropertiesTableProps {
  name: string;
}

export const PropertiesTables: React.FC<PropertiesTableProps> = ({ name }) => {
  const properties = loadProperties(name);
  const isMounted = useIsMounted();

  if (!isMounted) {
    return <p>...</p>;
  }

  if (!properties) {
    return <p>Keine Properties vorhanden.</p>;
  }

  return (
    <>
      <PropertiesTable properties={properties.other}></PropertiesTable>
      {properties?.events && properties?.events.length > 0 && (
        <Accordion>
          <Heading>Events</Heading>
          <Content>
            <PropertiesTable properties={properties.events}></PropertiesTable>
          </Content>
        </Accordion>
      )}
      {properties?.accessibility && properties?.accessibility.length > 0 && (
        <Accordion>
          <Heading>Accessibility</Heading>
          <Content>
            <PropertiesTable
              properties={properties.accessibility}
            ></PropertiesTable>
          </Content>
        </Accordion>
      )}
    </>
  );
};
