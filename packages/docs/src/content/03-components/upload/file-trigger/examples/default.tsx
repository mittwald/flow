import FileTrigger, {
  FileController,
} from "@mittwald/flow-react-components/FileTrigger";
import Button from "@mittwald/flow-react-components/Button";

export default () => {
  const controller = FileController.useNew();

  return (
    <FileTrigger controller={controller}>
      <Button>Datei auswählen</Button>
    </FileTrigger>
  );
};
