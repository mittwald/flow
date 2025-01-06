"use client";

import {
  List,
  ListItemView,
  Heading,
  Text,
} from "@mittwald/flow-remote-react-components";
import React from "react";
import { typedList } from "@mittwald/flow-react-components/List";
import { demoData } from "@/app/remote/list/demoData";

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
    </List>
  );
}
