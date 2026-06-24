"use client";
import { type FC, useEffect, useRef, useSyncExternalStore } from "react";
import { MDXRemote as NextMDXRemote } from "next-mdx-remote";
import type { LiveCodeEditorProps } from "@/lib/liveCode/components/LiveCodeEditor/LiveCodeEditor";
import LiveCodeEditor from "@/lib/liveCode/components/LiveCodeEditor/LiveCodeEditor";
import { PropertiesTables } from "@/lib/PropertiesTables/PropertiesTables";
import { MdxFile } from "@/lib/mdx/MdxFile";
import type { SerializedMdxFile } from "@/lib/mdx/MdxFile";
import styles from "./customComponents.module.css";
import type { DoAndDontTileProps } from "@/lib/mdx/components/DoAndDont/ExampleTile";
import ExampleTile from "@/lib/mdx/components/DoAndDont/ExampleTile";
import { createCustomComponents } from "@/lib/mdx/components/MdxFileView/customComponents";
import { usePathname } from "next/navigation";

interface Props {
  mdxFile: SerializedMdxFile;
  indexFile?: SerializedMdxFile;
}

interface ExampleProps extends DoAndDontTileProps {
  example?: string;
  exampleText?: string;
}

interface Snapshot {
  ready: boolean;
  version: number;
  routeKey: string | null;
}

function createMdxStore() {
  let snapshot: Snapshot = { ready: false, version: 0, routeKey: null };
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  return {
    subscribe(fn: () => void) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    getSnapshot: () => snapshot,

    start(routeKey: string) {
      snapshot = {
        ready: false,
        version: snapshot.version + 1,
        routeKey,
      };
      emit();
    },

    markReady(routeKey: string) {
      if (snapshot.routeKey !== routeKey) return;
      snapshot = { ...snapshot, ready: true };
      emit();
    },
  };
}

export const mdxStore = createMdxStore();

export const useMdxStatus = () => {
  return useSyncExternalStore(
    mdxStore.subscribe,
    mdxStore.getSnapshot,
    mdxStore.getSnapshot,
  );
};

export const MdxFileView: FC<Props> = (props) => {
  const mdxFile = MdxFile.deserialize(props.mdxFile);
  const pathname = usePathname();
  const routeKey = `${pathname}:${mdxFile.mdxSource?.compiledSource?.length ?? 0}`;

  const ExampleLiveCodeEditor: FC<
    {
      example?: string;
    } & Omit<LiveCodeEditorProps, "code" | "className">
  > = ({ example = "default", ...rest }) => (
    <LiveCodeEditor
      className={styles.liveCodeEditor}
      code={mdxFile.getExample(example)}
      {...rest}
    />
  );

  const ExampleDo: FC<ExampleProps> = (props) => {
    const { exampleText, example, children, ...rest } = props;

    return (
      <ExampleTile
        type="do"
        text={exampleText}
        code={example ? mdxFile.getExample(example) : undefined}
        {...rest}
      >
        {children}
      </ExampleTile>
    );
  };

  const ExampleDont: FC<ExampleProps> = (props) => {
    const { exampleText, example, children, ...rest } = props;

    return (
      <ExampleTile
        type="dont"
        text={exampleText}
        code={example ? mdxFile.getExample(example) : undefined}
        {...rest}
      >
        {children}
      </ExampleTile>
    );
  };

  const ExampleInfo: FC<ExampleProps> = (props) => {
    const { exampleText, example, children, ...rest } = props;
    return (
      <ExampleTile
        type="info"
        text={exampleText}
        code={example ? mdxFile.getExample(example) : undefined}
        {...rest}
      >
        {children}
      </ExampleTile>
    );
  };
  const ExampleStudio: FC<ExampleProps> = (props) => {
    const { exampleText, example, children, ...rest } = props;

    return (
      <ExampleTile
        type="mstudio"
        text={exampleText}
        code={example ? mdxFile.getExample(example) : undefined}
        {...rest}
      >
        {children}
      </ExampleTile>
    );
  };
  const ExamplePlain: FC<ExampleProps> = (props) => {
    const { exampleText, example, children, ...rest } = props;

    return (
      <ExampleTile
        text={exampleText}
        code={example ? mdxFile.getExample(example) : undefined}
        {...rest}
      >
        {children}
      </ExampleTile>
    );
  };

  const ExamplePropertiesTables = () => (
    <PropertiesTables
      name={
        props.indexFile?.mdxSource.frontmatter?.component || mdxFile.getTitle()
      }
    />
  );

  const mdxComponents = {
    LiveCodeEditor: ExampleLiveCodeEditor,
    PropertiesTables: ExamplePropertiesTables,
    Do: ExampleDo,
    Dont: ExampleDont,
    Info: ExampleInfo,
    MStudio: ExampleStudio,
    Plain: ExamplePlain,
    ...createCustomComponents(),
  };

  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    mdxStore.start(routeKey);

    queueMicrotask(() => {
      if (!cancelled) {
        mdxStore.markReady(routeKey);

        if (window.location.hash.length === 0) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [routeKey]);

  return (
    <div ref={rootRef} style={{ display: "contents" }}>
      <NextMDXRemote {...mdxFile.mdxSource} components={mdxComponents} />
    </div>
  );
};

export default MdxFileView;
