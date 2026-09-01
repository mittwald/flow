import { FileCard } from "@mittwald/flow-react-components";

<FileCard
  type="image/jpg"
  name="image.jpg"
  sizeInBytes={47500}
  onDelete={() => {
    console.log("delete");
  }}
/>;
