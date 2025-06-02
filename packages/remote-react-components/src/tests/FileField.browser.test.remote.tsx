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
