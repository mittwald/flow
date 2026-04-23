import type { FC } from "react";
import locales from "../../locales/*.locale.json";
import IllustratedMessageView from "@/views/IllustratedMessageView";
import HeadingView from "@/views/HeadingView";
import TextView from "@/views/TextView";
import { IconClose } from "@/components/Icon/components/icons";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider";

export type EmptyViewProps = Record<string, never>;

export const EmptyView: FC<EmptyViewProps> = () => {
  const stringFormatter = useLocalizedStringFormatter(locales, "List");

  return (
    <IllustratedMessageView>
      <IconClose />
      <HeadingView>{stringFormatter.format("noItems.heading")}</HeadingView>
      <TextView>{stringFormatter.format("noItems.text")}</TextView>
    </IllustratedMessageView>
  );
};
