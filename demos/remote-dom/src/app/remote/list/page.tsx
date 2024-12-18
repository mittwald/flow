"use client";

import { List } from "@mittwald/flow-remote-react-components";
import React from "react";
import { typedList } from "@mittwald/flow-react-components/List";
import { demoData } from "@/app/remote/list/demoData";

export default function Page() {
  const DemoList = typedList<(typeof demoData)[number]>();

  return (
    <List>
      <DemoList.Filter property="language" name="Language">
        {(val) => <>{val}</>}
      </DemoList.Filter>
      <DemoList.Search />
      <DemoList.StaticData data={demoData} />
      <DemoList.Item>
        {(d) => (
          <>
            {d.name} - {d.id}
          </>
        )}
      </DemoList.Item>
    </List>
  );
}
