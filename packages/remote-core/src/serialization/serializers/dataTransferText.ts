import { Serializer } from "@/serialization/Serializer";

export const dataTransferTextSerializer = new Serializer<DataTransfer, string>({
  name: "DataTransferText",
  serialize: {
    isApplicable: (val): val is DataTransfer => {
      return (
        val instanceof DataTransfer &&
        val.types.every((type) => type === "text/plain")
      );
    },
    apply: (dataTransfer) => dataTransfer.getData("text"),
  },
  deserialize: {
    apply: (asString) => {
      const dataTransfer = new DataTransfer();
      dataTransfer.setData("text", asString);
      return dataTransfer;
    },
  },
});
