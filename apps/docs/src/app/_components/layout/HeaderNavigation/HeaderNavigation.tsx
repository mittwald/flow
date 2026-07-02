"use client";
import type { FC } from "react";
import {
  HeaderNavigation as HeaderNavigationComponent,
  type OverlayController,
} from "@mittwald/flow-react-components";
import type { SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { ThemeSwitcherButton } from "./components/ThemeSwitcherButton";
import Groups from "@/app/_components/layout/Groups";
import { SearchButton } from "@/app/_components/layout/DocsSearch";

interface Props {
  docs: SerializedMdxFile[];
  className?: string;
  searchController: OverlayController;
}

const HeaderNavigation: FC<Props> = (props) => {
  return (
    <HeaderNavigationComponent
      className={props.className}
      aria-label="Header Navigation"
    >
      <Groups docs={props.docs} />
      <SearchButton controller={props.searchController} />
      <ThemeSwitcherButton />
    </HeaderNavigationComponent>
  );
};

export default HeaderNavigation;
