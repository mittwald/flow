import type { FC, PropsWithChildren } from "react";
import styles from "../MdxFileView/customComponents.module.css";
import { Text } from "@mittwald/flow-react-components/Text";
import LiveCodeEditor from "@/lib/liveCode/components/LiveCodeEditor";
import clsx from "clsx";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { IconCheck, IconClose } from "@mittwald/flow-react-components/Icons";

interface Props extends PropsWithChildren {
  code?: string;
  text?: string;
  type?: "do" | "dont";
  zoom?: number;
  lightBackground?: boolean;
  darkBackground?: boolean;
  heading?: string;
  mobile?: boolean;
}

export const DoAndDontTile: FC<Props> = (props) => {
  const {
    code,
    text,
    type,
    zoom,
    lightBackground,
    darkBackground,
    heading,
    mobile,
  } = props;

  return (
    <>
      {code && (
        <LiveCodeEditor
          editorDisabled
          code={code}
          className={styles.doAndDontCode}
          zoom={zoom}
          lightBackground={lightBackground}
          darkBackground={darkBackground}
          mobile={mobile}
        />
      )}
      {text && (
        <div className={styles.doAndDontText}>
          <Text>{text}</Text>
        </div>
      )}
      <article
        className={clsx(
          styles.doAndDontContent,
          type === "do" && styles.do,
          type === "dont" && styles.dont,
          (code || text) && styles.withContent,
        )}
      >
        {(type || heading) && (
          <Heading level={4}>
            {type === "do" ? (
              <IconCheck />
            ) : type === "dont" ? (
              <IconClose />
            ) : undefined}
            {heading
              ? heading
              : type === "do"
                ? "Do"
                : type === "dont"
                  ? "Don't"
                  : undefined}
          </Heading>
        )}

        {props.children}
      </article>
    </>
  );
};

export default DoAndDontTile;
