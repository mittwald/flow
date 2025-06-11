import { FileField, Text } from "@/auto-generated";
import { useState } from "react";

export const standard = () => <FileField data-testid="field" />;

export const onChange = () => {
  const [uploadedBytes, setUploadedBytes] = useState(0);
  return (
    <>
      {uploadedBytes > 0 && (
        <Text data-testid="uploaded-bytes">{uploadedBytes}</Text>
      )}
      <FileField
        data-testid="field"
        onChange={(fileList) => {
          const file = fileList?.[0];
          file
            ?.arrayBuffer()
            .then((buffer) => setUploadedBytes(buffer.byteLength));
        }}
      />
    </>
  );
};

export const onChangeMultiple = () => {
  const [uploadedBytes, setUploadedBytes] = useState<number[]>([]);
  return (
    <>
      {uploadedBytes.length >= 1 && (
        <Text data-testid="uploaded-bytes">{uploadedBytes.join(",")}</Text>
      )}
      <FileField
        multiple
        data-testid="field"
        onChange={async (fileList) => {
          const resolvedBytes = await Promise.all(
            Array.from(fileList ?? []).map(async (f) => {
              const fileBuffer = await f.arrayBuffer();
              return fileBuffer.byteLength;
            }),
          );
          setUploadedBytes(resolvedBytes);
        }}
      />
    </>
  );
};
