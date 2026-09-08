import {
  IconDanger,
  IllustratedMessage,
  ImageCropper,
  Text,
} from "@mittwald/flow-react-components";

<ImageCropper
  image="/assets/dieses-bild-existiert-nicht.jpg"
  errorView={
    <IllustratedMessage color="danger">
      <IconDanger />
      <Text>
        Dieses Bild ist nicht mehr verfügbar. Bitte lade es
        erneut hoch.
      </Text>
    </IllustratedMessage>
  }
/>;
