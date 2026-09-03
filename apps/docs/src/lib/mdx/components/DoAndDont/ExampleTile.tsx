import type { FC, PropsWithChildren } from "react";
import styles from "../MdxFileView/customComponents.module.css";
import { Text } from "@mittwald/flow-react-components";
import LiveCodeEditor from "@/lib/liveCode/components/LiveCodeEditor";
import clsx from "clsx";
import { Heading } from "@mittwald/flow-react-components";
import {
  IconCheck,
  IconClose,
  IconInfo,
  IconMittwald,
} from "@mittwald/flow-react-components";

export interface DoAndDontTileProps extends PropsWithChildren {
  code?: string;
  text?: string;
  type?: "do" | "dont" | "info" | "mstudio";
  zoom?: number;
  bgColor?: "mstudio" | "dark" | "light" | "darkStatic" | "lightStatic";
  heading?: string;
  mobile?: boolean;
  row?: boolean;
}

export const ExampleTile: FC<DoAndDontTileProps> = (props) => {
  const { code, text, type, heading, mobile, ...rest } = props;

  const headingIcon =
    type === "do" ? (
      <IconCheck />
    ) : type === "dont" ? (
      <IconClose />
    ) : type === "info" ? (
      <IconInfo />
    ) : type === "mstudio" ? (
      <IconMittwald />
    ) : undefined;

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
          mobile={mobile}
          {...rest}
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

export default ExampleTile;
