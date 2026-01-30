import React, { type FC } from "react";
import AccordionView from "@/views/AccordionView";
import HeadingView from "@/views/HeadingView";
import { useLocalizedStringFormatter } from "react-aria";
import ContentView from "@/views/ContentView";
import RadioGroupView from "@/views/RadioGroupView";
import RadioView from "@/views/RadioView";
import { useList } from "@/components/List";
import locales from "../../../../locales/*.locale.json";

export const SortingAccordion: FC = () => {
  const list = useList();
  const stringFormatter = useLocalizedStringFormatter(locales);

  const sorting = list.visibleSorting;
  const activeSorting = sorting.find((s) => s.isSorted());

  if (sorting.length === 0) {
    return null;
  }

  return (
    <AccordionView>
      <HeadingView>{stringFormatter.format("list.sorting")}</HeadingView>
      <ContentView>
        <RadioGroupView value={activeSorting?.id} m={[1, 1]}>
          {sorting.map((s) => (
            <RadioView
              key={s.id}
              value={s.id}
              onPress={() => list.getSorting(s.id).enable()}
            >
              {s.name ?? s.property}
            </RadioView>
          ))}
        </RadioGroupView>
      </ContentView>
    </AccordionView>
  );
};
