"use client";
import type { FC } from "react";
import {
  WBox,
  WCircle,
  WFrame,
  WRow,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";

export const ListWireframe: FC = () => (
  <WFrame scale={0.78}>
    <WStack>
      <WBox
        padding={12}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <WRow>
          <WCircle size={24} padding={0} />
          <WText width="60%" />
        </WRow>
      </WBox>
      <WBox
        padding={12}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <WRow>
          <WCircle size={24} padding={0} />
          <WText width="60%" />
        </WRow>
      </WBox>
      <WBox
        padding={12}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <WRow>
          <WCircle size={24} padding={0} />
          <WText width="60%" />
        </WRow>
      </WBox>
    </WStack>
  </WFrame>
);

export default ListWireframe;
