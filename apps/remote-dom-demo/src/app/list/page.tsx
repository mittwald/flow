"use client";

import {
  Avatar,
  ContextMenu,
  Heading,
  List,
  MenuItem,
  Section,
  Text,
  typedList,
} from "@mittwald/flow-remote-react-components";
import React from "react";
import { demoData } from "~/app/list/demoData";
import { IconEmail } from "@mittwald/flow-remote-react-components/Icons";

export default function Page() {
  const DemoList = typedList<(typeof demoData)[number]>();

  return (
    <Section>
      <List onAction={console.log} batchSize={10}>
        <DemoList.Filter property="language" name="Language">
          {(val) => <>{val}</>}
        </DemoList.Filter>
        <DemoList.Search autoSubmit />
        <DemoList.StaticData data={demoData} />
        <DemoList.Item textValue={(d) => d.name}>
          {(d) => (
            <DemoList.ItemView>
              <Avatar>
                <IconEmail />
              </Avatar>
              <Heading>
                {d.name} ({d.language})
              </Heading>
              <Text>{d.bio.slice(0, 100)}</Text>
              <ContextMenu>
                <MenuItem>
                  <Text>Menu item</Text>
                </MenuItem>
              </ContextMenu>
            </DemoList.ItemView>
          )}
        </DemoList.Item>
        <DemoList.Table>
          <DemoList.TableHeader>
            <DemoList.TableColumn>Name</DemoList.TableColumn>
          </DemoList.TableHeader>
          <DemoList.TableBody>
            <DemoList.TableRow>
              <DemoList.TableCell>{(d) => d.name}</DemoList.TableCell>
            </DemoList.TableRow>
          </DemoList.TableBody>
        </DemoList.Table>
      </List>
    </Section>
  );
}
