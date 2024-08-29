import type { FC, PropsWithChildren } from "react";
import styles from "../MdxFileView/customComponents.module.css";
import { Text } from "@mittwald/flow-react-components/Text";
import LiveCodeEditor from "@/lib/liveCode/components/LiveCodeEditor";
import clsx from "clsx";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { IconCheck, IconClose } from "@mittwald/flow-react-components/Icons";

export interface DoAndDontTileProps extends PropsWithChildren {
  code?: string;
  text?: string;
  type?: "do" | "dont";
  zoom?: number;
  bgColor?: "default" | "dark" | "light";
  heading?: string;
  mobile?: boolean;
}

export const DoAndDontTile: FC<DoAndDontTileProps> = (props) => {
  const { code, text, type, zoom, bgColor, heading, mobile } = props;

  const headingIcon =
    type === "do" ? <IconCheck /> : type === "dont" ? <IconClose /> : undefined;

  const headingText = heading
    ? heading
    : type === "do"
      ? "Do"
      : type === "dont"
        ? "Don't"
        : undefined;

  return (
    <>
      {code && (
        <LiveCodeEditor
          editorDisabled
          code={code}
          className={clsx(styles.doAndDontCode, mobile && styles.mobileCode)}
          zoom={zoom}
          bgColor={bgColor}
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
            {headingIcon}
            {headingText}
          </Heading>
        )}

        {props.children}
      </article>
    </>
  );
};

export default DoAndDontTile;
