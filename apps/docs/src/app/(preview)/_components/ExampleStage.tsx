"use client";

import { type FC, useEffect, useState } from "react";
import LiveCodeEditor from "@/lib/liveCode/components/LiveCodeEditor/LiveCodeEditor";
import styles from "./ExampleStage.module.scss";

interface Props {
  code: string;
}

/**
 * One example's preview, framed exactly as on its Styleguide page but without
 * the editor. `data-ready` flips once the example has mounted on the client:
 * the server-rendered markup lacks everything that appears only after
 * hydration, such as an open overlay.
 */
export const ExampleStage: FC<Props> = ({ code }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div
      className={styles.stage}
      data-example-stage
      data-ready={mounted || undefined}
    >
      <LiveCodeEditor code={code} editorDisabled />
    </div>
  );
};
