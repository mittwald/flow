import {
  Button,
  Flex,
  Image,
  LightBox,
  LightBoxTrigger,
  ActionGroup,
  LightBoxGallery,
  LightBoxGalleryItem,
  IconDownload,
} from "@mittwald/flow-react-components";

export default () => {
  const images = [
    "https://mittwald.github.io/flow/assets/mittwald_logo_rgb.jpg",
    "https://cdn.shopify.com/s/files/1/2022/6883/products/IMG_2002_250x250@2x.JPG?v=1538235544",
  ];

  return (
    <Flex gap="m">
      {images.map((src, index) => (
        <LightBoxTrigger key={index}>
          <Button>
            <Image
              alt=""
              src={src}
              height="100px"
              withBorder
            />
          </Button>
          <LightBox>
            <LightBoxGallery defaultIndex={index}>
              {images.map((src) => (
                <LightBoxGalleryItem>
                  <Image src={src} />
                  <ActionGroup>
                    <Button aria-label="Herunterladen">
                      <IconDownload />
                    </Button>
                  </ActionGroup>
                </LightBoxGalleryItem>
              ))}
            </LightBoxGallery>
          </LightBox>
        </LightBoxTrigger>
      ))}
    </Flex>
  );
};
