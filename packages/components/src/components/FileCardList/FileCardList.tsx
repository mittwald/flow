import type { ColumnLayoutProps } from "@/components/ColumnLayout";
import { ColumnLayout } from "@/components/ColumnLayout";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

export type FileCardListProps = Omit<ColumnLayoutProps, "elementType"> &
  FlowComponentProps<HTMLUListElement>;

/** @flr-generate all */
export const FileCardList = flowComponent("FileCardList", (props) => {
  const { className, ref, children, ...rest } = props;

  const propsContext: PropsContext = {
    FileCard: { elementType: "li" },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <ColumnLayout ref={ref} elementType="ul" className={className} {...rest}>
        {children}
      </ColumnLayout>
    </PropsContextProvider>
  );
});

export default FileCardList;
