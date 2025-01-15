"use client";

import {
  ListItemView,
  Heading,
  Text,
  List,
  typedList,
} from "@mittwald/flow-remote-react-components";
import React from "react";
import { demoData } from "~/app/remote/list/demoData";

export default function Page() {
  const DemoList = typedList<(typeof demoData)[number]>();

  return (
    <List onAction={console.log} batchSize={10}>
      <DemoList.Filter property="language" name="Language">
        {(val) => <>{val}</>}
      </DemoList.Filter>
      <DemoList.Search autoSubmit />
      <DemoList.StaticData data={demoData} />
      <DemoList.Item>
        {(d) => (
          <ListItemView>
            <Heading>
              {d.name} ({d.language})
            </Heading>
            <Text>{d.bio}</Text>
          </ListItemView>
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
  );
}
