import type { FC, PropsWithChildren } from "react";
import styles from "../MdxFileView/customComponents.module.css";
import { Text } from "@mittwald/flow-react-components/Text";
import LiveCodeEditor from "@/lib/liveCode/components/LiveCodeEditor";
import clsx from "clsx";

interface Props extends PropsWithChildren {
  code?: string;
  text?: string;
  type?: "do" | "dont";
}

export const DoAndDontTile: FC<Props> = (props) => {
  const { code, text, type } = props;

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
      {text && (
        <div
          className={clsx(
            styles.doAndDontText,
            type === "do" && styles.doText,
            type === "dont" && styles.dontText,
          )}
        >
          <Text>{text}</Text>
        </div>
      )}
      <div
        className={clsx(
          styles.doAndDontContent,
          type === "do" && styles.do,
          type === "dont" && styles.dont,
          (code || text) && styles.withContent,
        )}
      >
        {props.children}
      </div>
    </>
  );
};

export default DoAndDontTile;
