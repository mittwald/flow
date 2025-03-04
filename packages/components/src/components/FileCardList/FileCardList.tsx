import type { ColumnLayoutProps } from "@/components/ColumnLayout";
import { ColumnLayout } from "@/components/ColumnLayout";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";

export type FileCardListProps = Omit<ColumnLayoutProps, "elementType"> &
  FlowComponentProps;

/** @flr-generate all */
export const FileCardList = flowComponent("FileCardList", (props) => {
  const { className, ...rest } = props;

  const propsContext: PropsContext = {
    FileCard: { elementType: "li" },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <ColumnLayout elementType="ul" className={className} {...rest} />
    </PropsContextProvider>
  );
});

export default FileCardList;
