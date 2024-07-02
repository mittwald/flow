import FileTrigger, {
  useFileController,
} from "@mittwald/flow-react-components/FileTrigger";
import Button from "@mittwald/flow-react-components/Button";

export default () => {
  const controller = useFileController();

  return (
    <FileTrigger controller={controller}>
      <Button>Datei auswählen</Button>
    </FileTrigger>
  );
};
