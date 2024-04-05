import BoldTextPlaceholder from "@mittwald/flow-react-components/BoldTextPlaceholder";
import Text from "@mittwald/flow-react-components/Text";

<Column>
  <Text style={{ borderInline: "2px solid red" }}>
    <BoldTextPlaceholder>Example Text</BoldTextPlaceholder>
  </Text>
  <Text
    style={{
      borderInline: "2px solid red",
      fontWeight: "bold",
    }}
  >
    <BoldTextPlaceholder>Example Text</BoldTextPlaceholder>
  </Text>
</Column>;
