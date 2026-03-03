import React, { type FC } from "react";
import AccordionView from "@/views/AccordionView";
import HeadingView from "@/views/HeadingView";
import ContentView from "@/views/ContentView";
import RadioGroupView from "@/views/RadioGroupView";
import RadioView from "@/views/RadioView";
import { useAvailableViewModes } from "@/components/List/components/Header/lib";
import { useList } from "@/components/List";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../../../../locales/*.locale.json";

export const ViewModeAccordion: FC = () => {
  const list = useList();
  const stringFormatter = useLocalizedStringFormatter(locales);

  const availableViewModes = useAvailableViewModes();
  const selectedViewMode = list.viewMode;

  if (availableViewModes.length <= 1) {
    return null;
  }

  return (
    <AccordionView>
      <HeadingView>
        {stringFormatter.format("list.settings.viewMode")}
      </HeadingView>
      <ContentView>
        <RadioGroupView value={selectedViewMode} m={[1, 1]}>
          {availableViewModes.map((v) => (
            <RadioView key={v} value={v} onPress={() => list.setViewMode(v)}>
              {stringFormatter.format(`list.settings.viewMode.${v}`)}
            </RadioView>
          ))}
        </RadioGroupView>
      </ContentView>
    </AccordionView>
  );
};
