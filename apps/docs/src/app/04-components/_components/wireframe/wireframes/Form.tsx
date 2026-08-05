"use client";
import type { FC } from "react";
import {
  WButton,
  WFrame,
  WInput,
  WRow,
  WStack,
} from "@/app/04-components/_components/wireframe/primitives";
import styles from "./wireframes.module.scss";

export const FormWireframe: FC = () => (
  <WFrame className={styles.scale78}>
    <WStack>
      <WStack>
        <WInput />
      </WStack>
      <WStack>
        <WInput />
      </WStack>
      <WRow justifyContent="flex-end">
        <WButton width="40%" />
      </WRow>
    </WStack>
  </WFrame>
);

export default FormWireframe;
