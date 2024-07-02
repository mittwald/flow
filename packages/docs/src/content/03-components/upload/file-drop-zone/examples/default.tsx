import FileDropZone from "@mittwald/flow-react-components/FileDropZone";
import { FileController } from "@mittwald/flow-react-components/FileTrigger";

export default () => {
  const controller = FileController.useNew();

  return <FileDropZone controller={controller} />;
};
