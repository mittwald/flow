import type { FC } from "react";
import React from "react";
import { IconFilter } from "@/components/Icon/components/icons";
import ButtonView from "@/views/ButtonView";
import ContextMenu, {
  ContextMenuSection,
  ContextMenuTrigger,
} from "@/components/ContextMenu";
import { useList } from "@/components/List";
import HeadingView from "@/views/HeadingView";
import { Separator } from "@/components/Separator";
import { FilterMenuItem } from "@/components/List/components/Header/components/Filters/FilterMenuItem";
import styles from "@/components/List/components/Header/Header.module.css";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../../../../locales/*.locale.json";

export const CombinedFilterMenu: FC = () => {
  const list = useList();

  const filters = list.filters;

  const stringFormatter = useLocalizedStringFormatter(locales);

  if (filters.length === 0) {
    return null;
  }

  return (
    <ContextMenuTrigger>
      <ButtonView
        className={styles.mobile}
        variant="outline"
        color="secondary"
        aria-label={stringFormatter.format("list.filters")}
      >
        <IconFilter />
      </ButtonView>
      <ContextMenu>
        {filters.map((f, i) => {
          const activeFilterKeys = f.values
            .filter((v) => v.isActive)
            .map((v) => v.id);

          return (
            <>
              <ContextMenuSection
                selectionMode={f.mode === "one" ? "single" : "multiple"}
                selectedKeys={activeFilterKeys}
              >
                <HeadingView>{f.name ?? f.property}</HeadingView>
                {f.values.map((v) => (
                  <FilterMenuItem filterValue={v} />
                ))}
              </ContextMenuSection>
              {i + 1 < filters.length && <Separator />}
            </>
          );
        })}
      </ContextMenu>
    </ContextMenuTrigger>
  );
};
