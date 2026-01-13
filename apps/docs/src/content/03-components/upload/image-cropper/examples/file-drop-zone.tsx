import {
  Button,
  Heading,
  FileField,
  ImageCropper,
  IconImage,
  Section,
  FileDropZone,
  Text,
  Flex,
  IconClose,
  Action,
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import {
  Form,
  SubmitButton,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { sleep } from "@/content/03-components/actions/action/examples/lib";

export default () => {
  const form = useForm<{
    files: FileList | File[] | [];
  }>({ defaultValues: { files: [] } });
  const Field = typedField(form);

  const watchedFiles = [...form.watch("files")];

  return (
    <Section>
      <Form form={form} onSubmit={sleep}>
        {watchedFiles.length === 0 && (
          <FileDropZone
            accept="image/png"
            onChange={(f) => {
              if (f) {
                form.setValue("files", f);
              }
            }}
          >
            <IconImage />
            <Heading>Bild ablegen</Heading>
            <Text>
              Bitte wähle ein Bild vom Typ PNG aus.
            </Text>
            <Field
              name="files"
              rules={{
                required: "Bitte wähle ein Bild aus",
              }}
            >
              <FileField>
                <Button variant="outline" color="dark">
                  Bild auswählen
                </Button>
              </FileField>
            </Field>
          </FileDropZone>
        )}

        {watchedFiles.length > 0 && (
          <Flex justify="center" align="start" gap="m">
            <ImageCropper
              width={200}
              height={200}
              image={watchedFiles[0]}
            />
            <Action
              onAction={() => form.setValue("files", [])}
            >
              <Button
                variant="plain"
                color="secondary"
                aria-label="Bild entfernen"
              >
                <IconClose />
              </Button>
            </Action>
          </Flex>
        )}
        <SubmitButton>Hochladen</SubmitButton>
      </Form>
    </Section>
  );
};
