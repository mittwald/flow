"use client";
import type { FC } from "react";
import {
  WBar,
  WBox,
  WCircle,
  WFrame,
  WRow,
  WStack,
} from "@/app/04-components/_components/wireframe/primitives";

export const PlaceholderWireframe: FC = () => (
  <WFrame>
    <WStack width="72%">
      <WBox tone="300" height="var(--size-px--xxl)" />
      <WStack>
        <WRow>
          <WCircle
            tone="500"
            width="var(--size-px--s)"
            height="var(--size-px--s)"
          />
          <WBar tone="600" width="62%" />
        </WRow>
        <WBar tone="500" width="86%" />
        <WBar tone="400" width="54%" />
      </WStack>
    </WStack>
  </WFrame>
);

export default PlaceholderWireframe;
