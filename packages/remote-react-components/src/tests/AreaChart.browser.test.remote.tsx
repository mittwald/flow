import { Area, AreaChart, XAxis, YAxis } from "@/auto-generated";
import React from "react";

export const standard = () => (
  <AreaChart
    height="200px"
    data={[
      {
        name: "Stat 1",
        key: 40,
      },
      {
        name: "Stat 2",
        key: 30,
      },
    ]}
    data-testid="areaChart"
  >
    <Area dataKey="key" />
    <XAxis dataKey="name" />
    <YAxis />
  </AreaChart>
);
