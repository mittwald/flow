import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExampleStage } from "@/app/(preview)/_components/ExampleStage";
import { listExamplePaths, readExample } from "@/lib/liveCode/examplePaths";

interface Props {
  params: Promise<{ example: string[] }>;
}

export const generateStaticParams = () =>
  listExamplePaths().map((example) => ({ example: example.split("/") }));

export const metadata: Metadata = {
  title: "Beispiel – Flow",
  robots: { index: false },
};

/**
 * Renders one Styleguide example on its own — the source `pnpm release:figure`
 * captures release-note figures from, so they show the neutral docs content.
 * `next dev` only: the `.dev.tsx` extension is a page extension in the
 * development phase alone (see `next.config.js`), so the static export ships
 * none of these pages.
 */
const ExamplePreviewPage = async (props: Props) => {
  const { example } = await props.params;
  const code = readExample(example.join("/"));

  if (code === undefined) {
    notFound();
  }

  return <ExampleStage code={code} />;
};

export default ExamplePreviewPage;
