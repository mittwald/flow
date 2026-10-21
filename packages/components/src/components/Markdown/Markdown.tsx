import { CodeBlock } from "@/components/CodeBlock";
import { Heading } from "@/components/Heading";
import { Image } from "@/components/Image";
import { InlineCode } from "@/components/InlineCode";
import { Link } from "@/components/Link";
import { Separator } from "@/components/Separator";
import { Text } from "@/components/Text";
import type { CSSProperties, FC, Ref } from "react";
import { Children, isValidElement, useId, useMemo } from "react";
import type { Components, Options } from "react-markdown";
import ReactMarkdown from "react-markdown";
import styles from "./Markdown.module.scss";
import { extractTextFromFirstChild } from "@/lib/react/remote";
import {
  isAlphaColor,
  type AlphaColor,
  type PropsWithClassName,
} from "@/lib/types/props";
import clsx from "clsx";
import remarkGfm from "remark-gfm";
import { getHeadingLevelWithOffset } from "@/components/Markdown/lib/getHeadingLevelWithOffset";
import { isExternalHref } from "@/components/Markdown/lib/isExternalHref";
import type { CodeEditorLanguage } from "@/components/CodeEditor/languages";
import {
  SkeletonBlockText,
  SkeletonInlineContent,
} from "@/components/Markdown/components/SkeletonBlocks";
import { useSkeletonMode } from "@/components/SkeletonMode/skeletonModeContext";
import { TaskListCheckbox } from "@/components/Markdown/components/TaskListCheckbox";
import { removeNewlinesAfterBreaks } from "@/components/Markdown/lib/removeNewlinesAfterBreaks";
import { removeSpaceAfterTaskListCheckbox } from "@/components/Markdown/lib/removeSpaceAfterTaskListCheckbox";

export interface MarkdownProps
  extends PropsWithClassName, Omit<Options, "components"> {
  /** The color schema of the markdown component. @default "default" */
  color?: "default" | AlphaColor;
  /** Shifts all heading levels by the given offset. @default 0 */
  headingOffset?: number;
  /** Allows overriding markdown element renderers from outside. */
  components?: Components;
  /** @internal */
  style?: CSSProperties;
  /** A ref to the elements root. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * @flr-generate all
 * @flr-ignore-props components
 */
export const Markdown: FC<MarkdownProps> = (props) => {
  const {
    children,
    color = "default",
    className,
    headingOffset = 0,
    components: customComponents,
    ref,
    allowElement,
    allowedElements,
    disallowedElements,
    rehypePlugins,
    remarkPlugins,
    remarkRehypeOptions,
    skipHtml,
    unwrapDisallowed,
    urlTransform,
    ...rest
  } = props;

  const isSkeleton = useSkeletonMode();
  /* Footnote ids are per document, so two instances on one page would share
     them and a back link would jump into the other one. */
  const clobberPrefix = `user-content-${useId().replace(/[^\w-]/g, "")}-`;

  /* react-markdown uses the renderers as element types: new ones on every
     render would remount the whole tree. */
  const defaultComponents = useMemo<Components>(
    () => ({
      /* GFM footnotes link through `id` (the back link's target), `aria-label`
       and `aria-describedby`. */
      a: (props) => (
        <Link
          id={props.id}
          aria-label={props["aria-label"]}
          aria-describedby={props["aria-describedby"]}
          target={isExternalHref(props.href) ? "_blank" : undefined}
          color={color}
          href={props.href}
        >
          {props.children}
        </Link>
      ),
      p: (props) => (
        <Text elementType="p" color={color}>
          {removeSpaceAfterTaskListCheckbox(
            removeNewlinesAfterBreaks(props.children),
          )}
        </Text>
      ),
      code: (props) => <InlineCode color={color}>{props.children}</InlineCode>,
      h1: (props) => (
        <Heading
          id={props.id}
          level={getHeadingLevelWithOffset(1, headingOffset)}
          color={color}
        >
          {props.children}
        </Heading>
      ),
      h2: (props) => (
        <Heading
          id={props.id}
          level={getHeadingLevelWithOffset(2, headingOffset)}
          color={color}
        >
          {props.children}
        </Heading>
      ),
      h3: (props) => (
        <Heading
          id={props.id}
          level={getHeadingLevelWithOffset(3, headingOffset)}
          color={color}
        >
          {props.children}
        </Heading>
      ),
      h4: (props) => (
        <Heading
          id={props.id}
          level={getHeadingLevelWithOffset(4, headingOffset)}
          color={color}
        >
          {props.children}
        </Heading>
      ),
      h5: (props) => (
        <Heading
          id={props.id}
          level={getHeadingLevelWithOffset(5, headingOffset)}
          color={color}
        >
          {props.children}
        </Heading>
      ),
      h6: (props) => (
        <Heading
          id={props.id}
          level={getHeadingLevelWithOffset(6, headingOffset)}
          color={color}
        >
          {props.children}
        </Heading>
      ),
      hr: () => <Separator />,
      pre: (props) => {
        const preElementContent = Children.toArray(props.children)[0];

        return (
          <CodeBlock
            copyable={false}
            language={
              isValidElement<{ className?: string }>(preElementContent) &&
              preElementContent.props.className
                ? (preElementContent.props.className.replace(
                    "language-",
                    "",
                  ) as CodeEditorLanguage)
                : undefined
            }
            code={String(
              isValidElement<{ children: string }>(preElementContent)
                ? preElementContent.props.children
                : preElementContent,
            ).trim()}
          />
        );
      },
      ul: ({ node: ignoredNode, ...props }) => (
        <SkeletonBlockText color={color}>
          <ul {...props} />
        </SkeletonBlockText>
      ),
      ol: ({ node: ignoredNode, ...props }) => (
        <SkeletonBlockText color={color}>
          <ol {...props} />
        </SkeletonBlockText>
      ),
      li: ({ node: ignoredNode, children, className, ...props }) => (
        <li
          {...props}
          className={clsx(
            className,
            className?.includes("task-list-item") && styles.taskListItem,
          )}
        >
          <SkeletonInlineContent>
            {removeSpaceAfterTaskListCheckbox(children)}
          </SkeletonInlineContent>
        </li>
      ),
      input: ({ node: ignoredNode, ...props }) =>
        props.type === "checkbox" ? (
          <TaskListCheckbox checked={props.checked} />
        ) : (
          <input {...props} />
        ),
      table: ({ node: ignoredNode, ...props }) => (
        <div className={styles.tableContainer}>
          <table {...props} />
        </div>
      ),
      th: ({ node: ignoredNode, children, ...props }) => (
        <th {...props}>
          <SkeletonInlineContent>{children}</SkeletonInlineContent>
        </th>
      ),
      td: ({ node: ignoredNode, children, ...props }) => (
        <td {...props}>
          <SkeletonInlineContent>{children}</SkeletonInlineContent>
        </td>
      ),
      /* A text bar resets the mode for its content, so the image reads it
       from here. A skeleton issues no request. */
      img: ({ node: ignoredNode, ...props }) =>
        isSkeleton ? null : <Image {...props} withBorder />,
      blockquote: (props) => (
        <SkeletonBlockText color={color}>
          <blockquote>{props.children}</blockquote>
        </SkeletonBlockText>
      ),
    }),
    [color, headingOffset, isSkeleton],
  );

  const textContent = extractTextFromFirstChild(children);
  const mergedComponents = useMemo<Components>(
    () => ({
      ...defaultComponents,
      ...customComponents,
    }),
    [defaultComponents, customComponents],
  );

  return (
    <div
      className={clsx(
        styles.markdown,
        isAlphaColor(color) && styles[color],
        className,
      )}
      {...rest}
      ref={ref}
    >
      <ReactMarkdown
        allowElement={allowElement}
        allowedElements={allowedElements}
        disallowedElements={disallowedElements}
        rehypePlugins={rehypePlugins}
        remarkPlugins={remarkPlugins ?? [remarkGfm]}
        remarkRehypeOptions={{ clobberPrefix, ...remarkRehypeOptions }}
        skipHtml={skipHtml}
        unwrapDisallowed={unwrapDisallowed}
        urlTransform={urlTransform}
        components={mergedComponents}
      >
        {textContent}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
