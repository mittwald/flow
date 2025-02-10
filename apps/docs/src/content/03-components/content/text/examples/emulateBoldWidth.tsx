import { Text } from "@mittwald/flow-react-components";

<Column>
  <Text
    style={{ borderInline: "2px solid red" }}
    emulateBoldWidth
  >
    Das ist ein Text
  </Text>
  <Text style={{ borderInline: "2px solid red" }}>
    <strong>Das ist ein Text</strong>
  </Text>
</Column>;
