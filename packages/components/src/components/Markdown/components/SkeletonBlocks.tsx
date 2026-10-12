import {
  Children,
  type FC,
  isValidElement,
  type PropsWithChildren,
  type ReactNode,
  useContext,
} from "react";
import clsx from "clsx";
import { Text, type TextProps } from "@/components/Text";
import { SkeletonTextContent } from "@/components/SkeletonMode/components/SkeletonTextContent";
import {
  SkeletonModeReset,
  skeletonModeContext,
  useSkeletonMode,
} from "@/components/SkeletonMode/skeletonModeContext";
import styles from "../Markdown.module.scss";

/**
 * A text bar is an inline element and cannot wrap blocks. Markdown puts lists
 * and quotes into a `Text`, so in `SkeletonMode` this `Text` renders as real
 * text, and the blocks inside follow the skeleton rules on their own.
 */
export const SkeletonBlockText: FC<TextProps> = (props) => {
  const { children, className, ...rest } = props;

  const outerState = useContext(skeletonModeContext);

  return (
    <SkeletonModeReset>
      <Text
        {...rest}
        className={clsx(
          className,
          outerState.isEnabled && styles.skeletonBlock,
        )}
      >
        <skeletonModeContext.Provider value={outerState}>
          {children}
        </skeletonModeContext.Provider>
      </Text>
    </SkeletonModeReset>
  );
};

const blockTagNames = new Set([
  "blockquote",
  "div",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "ol",
  "p",
  "pre",
  "table",
  "ul",
]);

/** Whether a rendered markdown element is a block — a nested list, a paragraph. */
const isBlock = (child: ReactNode): boolean => {
  if (!isValidElement<{ node?: { tagName?: string } }>(child)) {
    return false;
  }

  const tagName =
    typeof child.type === "string" ? child.type : child.props.node?.tagName;

  return tagName !== undefined && blockTagNames.has(tagName);
};

const isBlank = (child: ReactNode) =>
  typeof child === "string" && child.trim() === "";

/**
 * The content of a list item or a table cell: each run of inline content
 * becomes one text bar, blocks inside — a nested list, the paragraphs of a
 * loose list — keep their own skeleton rules. Outside an enabled `SkeletonMode`
 * it renders its children unchanged.
 */
export const SkeletonInlineContent: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const isSkeleton = useSkeletonMode();

  if (!isSkeleton) {
    return children;
  }

  const content: ReactNode[] = [];
  let run: ReactNode[] = [];

  /* The line breaks around a nested list stay outside the bar. */
  const endRun = () => {
    const start = run.findIndex((child) => !isBlank(child));
    const end = run.findLastIndex((child) => !isBlank(child)) + 1;

    if (start === -1) {
      content.push(...run);
    } else {
      content.push(
        ...run.slice(0, start),
        <SkeletonTextContent key={content.length} defaultWidth="8em">
          {run.slice(start, end)}
        </SkeletonTextContent>,
        ...run.slice(end),
      );
    }

    run = [];
  };

  for (const child of Children.toArray(children)) {
    if (isBlock(child)) {
      endRun();
      content.push(child);
    } else {
      run.push(child);
    }
  }

  endRun();

  return content;
};
