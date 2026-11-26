import { useRef } from "react";
import { Area } from "@/components/CartesianChart";
import { ListItemView } from "@/components/List";
import { LightBoxGalleryItem } from "@/components/LightBox";

/* Props that omit `ref` get none from the factory. */
export const RefOmitted = () => {
  const ref = useRef<HTMLDivElement>(null);
  // @ts-expect-error Area has no element of its own to ref
  return <Area dataKey="value" ref={ref} />;
};

/* Props that declare `ref` keep it, even as a no-op. */
export const RefKept = () => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <>
      <ListItemView ref={ref} />
      <LightBoxGalleryItem ref={ref} />
    </>
  );
};
