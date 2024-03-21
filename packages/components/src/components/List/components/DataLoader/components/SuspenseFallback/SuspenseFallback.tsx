import { FC } from "react";
import { useList } from "@/components/List/hooks/useList";

interface Props {
  pageIndex: number;
}

export const SuspenseFallback: FC<Props> = (props) => {
  const { pageIndex } = props;
  const list = useList();
  list.loader.useSuspenseHook(pageIndex);
  return null;
};

export default SuspenseFallback;
