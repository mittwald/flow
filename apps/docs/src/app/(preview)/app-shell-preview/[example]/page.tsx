import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  appShellNames,
  appShellTitles,
  isAppShellName,
} from "@/lib/mdx/components/AppShellPreview";
import { AppShellStage } from "@/app/(preview)/_components/AppShellStage";

interface Props {
  params: Promise<{ example: string }>;
}

export const generateStaticParams = () =>
  appShellNames.map((example) => ({ example }));

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { example } = await props.params;

  return {
    title: isAppShellName(example)
      ? `${appShellTitles[example]} – Flow`
      : "App Shell – Flow",
  };
};

/**
 * Shows one App Shell on its own — what the "Vorschau" link in the Styleguide
 * opens in a new tab. The shell fills the viewport here: no docs chrome (see
 * the `(preview)` layout) and no scaling, so it can be operated like the real
 * thing.
 */
const AppShellPreviewPage = async (props: Props) => {
  const { example } = await props.params;

  if (!isAppShellName(example)) {
    notFound();
  }

  return <AppShellStage example={example} />;
};

export default AppShellPreviewPage;
