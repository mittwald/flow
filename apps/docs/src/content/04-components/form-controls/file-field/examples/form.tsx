import {
  Button,
  FileCard,
  FileCardList,
  FileField,
  Label,
  Section,
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import {
  Form,
  SubmitButton,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { sleep } from "@/content/04-components/actions/action/examples/lib";

export default () => {
  const form = useForm<{
    files: FileList | File[] | [];
  }>({ defaultValues: { files: [] } });
  const Field = typedField(form);

  const watchedFiles = [...form.watch("files")];

  return (
    <Section>
      <Form form={form} onSubmit={sleep}>
        <Field
          name="files"
          rules={{
            required:
              "Bitte wähle mindestens eine Datei aus",
          }}
        >
          <FileField multiple>
            <Label>Dateien</Label>
            <Button variant="outline" color="secondary">
              Auswählen
            </Button>
          </FileField>
        </Field>
        <FileCardList>
          {watchedFiles.map((file) => (
            <FileCard
              name={file.name}
              type={file.type}
              key={file.name}
              sizeInBytes={file.size}
              onDelete={() =>
                form.setValue(
                  "files",
                  watchedFiles.filter(
                    (watched) => watched !== file,
                  ),
                )
              }
            />
          ))}
        </FileCardList>
        <SubmitButton>Hochladen</SubmitButton>
      </Form>
    </Section>
  );
};
