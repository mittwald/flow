import {
  FileCard,
  FileCardList,
} from "@mittwald/flow-react-components";

<FileCardList aria-label="Hochgeladene Dateien">
  <FileCard
    name="file1.txt"
    onDelete={() => {
      console.log("delete");
    }}
  />
  <FileCard
    name="file2.txt"
    onDelete={() => {
      console.log("delete");
    }}
  />
  <FileCard
    name="file3.txt"
    onDelete={() => {
      console.log("delete");
    }}
  />
  <FileCard
    name="file4.txt"
    onDelete={() => {
      console.log("delete");
    }}
  />
  <FileCard
    type="image/jpg"
    name="image.jpg"
    onDelete={() => {
      console.log("delete");
    }}
  />
</FileCardList>;
