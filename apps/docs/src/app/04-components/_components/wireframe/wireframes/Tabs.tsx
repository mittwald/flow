"use client";
import type { FC } from "react";
import {
  WBox,
  WFrame,
  WRow,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const TabsWireframe: FC = () => (
  <WFrame>
    <WStack>
      <WRow>
        {[0, 1, 2].map((item) => (
          <WBox key={item} tone={item === 0 ? "300" : "100"} width="33%">
            <WText />
          </WBox>
        ))}
      </WRow>
      <WStack>
        <WText width="84%" />
        <WText width="58%" />
      </WStack>
    </WStack>
  </WFrame>
);

export default TabsWireframe;
