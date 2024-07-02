import FileDropZone from "@mittwald/flow-react-components/FileDropZone";
import { useFileController } from "@mittwald/flow-react-components/FileTrigger";

export default () => {
  const controller = useFileController();

  return <FileDropZone controller={controller} />;
};
