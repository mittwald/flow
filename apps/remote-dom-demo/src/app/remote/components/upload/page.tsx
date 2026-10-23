"use client";
import { ComponentGroupPage } from "@/app/remote/components/_lib/ComponentGroupPage";
import {
  Button,
  FileCard,
  FileCardList,
  FileDropZone,
  FileField,
  Heading,
  IconUpload,
  ImageCropper,
  Section,
  Text,
} from "@mittwald/flow-remote-react-components";
import { useState } from "react";

const blueprint =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23264cff'/%3E%3Ccircle cx='200' cy='150' r='90' fill='%23ffd400'/%3E%3C/svg%3E";

export default function Page() {
  const [files, setFiles] = useState<File[]>(() => [
    new File(["Death Star plans"], "death-star-plans.txt", {
      type: "text/plain",
    }),
  ]);
  const [croppedFile, setCroppedFile] = useState<string>();

  return (
    <ComponentGroupPage title="Upload">
      <Section>
        <Heading level={3}>FileDropZone, FileCardList and FileCard</Heading>
        <FileDropZone
          multiple
          onChange={(dropped) => {
            if (dropped) {
              setFiles((current) => [...current, ...dropped]);
            }
          }}
        >
          <IconUpload />
          <Heading>Drop the plans here</Heading>
          <FileField>
            <Button>Choose files</Button>
          </FileField>
        </FileDropZone>
        <FileCardList aria-label="Uploaded files">
          {files.map((file) => (
            <FileCard
              key={file.name}
              name={file.name}
              type={file.type}
              sizeInBytes={file.size}
              onDelete={() =>
                setFiles((current) => current.filter((f) => f !== file))
              }
            />
          ))}
        </FileCardList>
      </Section>

      <Section>
        <Heading level={3}>ImageCropper</Heading>
        <ImageCropper
          image={blueprint}
          width={300}
          height={300}
          onCropComplete={(croppedImage) =>
            setCroppedFile(`${croppedImage.name} (${croppedImage.size} B)`)
          }
        />
        <Text>Cropped file: {croppedFile ?? "–"}</Text>
      </Section>
    </ComponentGroupPage>
  );
}
