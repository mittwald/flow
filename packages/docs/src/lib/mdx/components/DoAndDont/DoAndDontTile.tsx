import type { FC, PropsWithChildren } from "react";
import styles from "../MdxFileView/customComponents.module.css";
import { Section } from "@mittwald/flow-react-components/Section";
import LiveCodeEditor from "@/lib/liveCode/components/LiveCodeEditor";
import clsx from "clsx";

interface Props extends PropsWithChildren {
  code?: string;
  type?: "do" | "dont";
}

export const DoAndDontTile: FC<Props> = (props) => {
  const { code, type } = props;

  return (
    <>
      {code && (
        <LiveCodeEditor
          editorDisabled
          code={code}
          className={clsx(
            styles.doAndDontCode,
            type === "do" && styles.doCode,
            type === "dont" && styles.dontCode,
          )}
        />
      )}
      <Section
        className={clsx(
          styles.doAndDontContent,
          type === "do" && styles.do,
          type === "dont" && styles.dont,
          code && styles.withCode,
        )}
      >
        {props.children}
      </Section>
    </>
  );
};

export default DoAndDontTile;
