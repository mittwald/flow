"use client";
import type { FC } from "react";
import {
  WBox,
  WCircle,
  WFrame,
  WIcon,
  WRow,
  WStack,
  WText,
} from "@/app/04-components/_components/wireframe/primitives";
import { IconContextMenu } from "@mittwald/flow-react-components";

export const ListWireframe: FC = () => (
  <WFrame>
    <WStack>
      <WBox
        padding={12}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <WRow alignItems="center">
          <WCircle height={24} width={24} padding={0} />
          <WText width="60%" />
        </WRow>
        <WIcon tone="800">
          <IconContextMenu size="s" />
        </WIcon>
      </WBox>
      <WBox
        padding={12}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <WRow alignItems="center">
          <WCircle height={24} width={24} padding={0} />
          <WText width="60%" />
        </WRow>
        <WIcon tone="800">
          <IconContextMenu size="s" />
        </WIcon>
      </WBox>
      <WBox
        padding={12}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <WRow alignItems="center">
          <WCircle height={24} width={24} padding={0} />
          <WText width="60%" />
        </WRow>
        <WIcon tone="800">
          <IconContextMenu size="s" />
        </WIcon>
      </WBox>
    </WStack>
  </WFrame>
);

export default ListWireframe;
