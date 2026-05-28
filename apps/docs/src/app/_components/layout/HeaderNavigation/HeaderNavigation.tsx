"use client";
import type { FC } from "react";
import { HeaderNavigation as HeaderNavigationComponent } from "@mittwald/flow-react-components";
import type { SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { ThemeSwitcherButton } from "./components/ThemeSwitcherButton";
import Groups from "@/app/_components/layout/Groups";

interface Props {
  docs: SerializedMdxFile[];
  className?: string;
}

const HeaderNavigation: FC<Props> = (props) => {
  return (
    <HeaderNavigationComponent
      className={props.className}
      aria-label="Header Navigation"
    >
      <Groups docs={props.docs} />
      <ThemeSwitcherButton />
    </HeaderNavigationComponent>
  );
};

export default HeaderNavigation;
