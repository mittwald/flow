import type { FC } from "react";
import { IconSearch } from "@/components/Icon/components/icons";
import locales from "../../locales/*.locale.json";
import IllustratedMessageView from "@/views/IllustratedMessageView";
import HeadingView from "@/views/HeadingView";
import TextView from "@/views/TextView";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider";

export type EmptySearchResultViewProps = Record<string, never>;

export const EmptySearchResultView: FC<EmptySearchResultViewProps> = () => {
  const stringFormatter = useLocalizedStringFormatter(locales, "List");

  return (
    <IllustratedMessageView>
      <IconSearch />
      <HeadingView>{stringFormatter.format("noResult.heading")}</HeadingView>
      <TextView>{stringFormatter.format("noResult.text")}</TextView>
    </IllustratedMessageView>
  );
};
