import type { PropsWithChildren } from "react";
import type { PropsWithElementType } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import SectionHeader from "@/components/Section/components/SectionHeader/SectionHeader";

export interface HeaderProps
  extends PropsWithChildren,
    PropsWithElementType<"div" | "header" | "span">,
    FlowComponentProps<HTMLDivElement | HTMLHeadElement | HTMLSpanElement> {
  /** @internal */
  renderSectionHeader?: boolean;
}

/** @flr-generate all */
export const Header = flowComponent(
  "Header",
  (props) => {
    const {
      children,
      ref,
      elementType = "header",
      renderSectionHeader,
      className,
      ...rest
    } = props;

    if (renderSectionHeader) {
      return (
        <SectionHeader ref={ref as never} className={className}>
          {children}
        </SectionHeader>
      );
    }

    const Element = elementType;

    return (
      <Element {...rest} className={className} ref={ref as never}>
        {children}
      </Element>
    );
  },
  {
    type: "layout",
  },
);

export default Header;
