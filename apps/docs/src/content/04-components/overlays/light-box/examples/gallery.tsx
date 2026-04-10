import {
  Button,
  Flex,
  Image,
  LightBox,
  LightBoxTrigger,
  ActionGroup,
  Gallery,
  GalleryItem,
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
            <Gallery defaultIndex={index}>
              {images.map((src) => (
                <GalleryItem>
                  <Image src={src} />
                  <ActionGroup>
                    <Button aria-label="Herunterladen">
                      <IconDownload />
                    </Button>
                  </ActionGroup>
                </GalleryItem>
              ))}
            </Gallery>
          </LightBox>
        </LightBoxTrigger>
      ))}
    </Flex>
  );
};
