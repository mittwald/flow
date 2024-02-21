import { PropsWithVariant, Variant } from "@/lib/types/props";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testStatusVariantCanBeOmitted() {
  // @ts-expect-error "success" status is excluded
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const testProps = {
    variant: "success",
  } as PropsWithVariant<Exclude<Variant, "success">>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testUnknownStatusVariantCanNotBeOmitted() {
  // @ts-expect-error Is unknown
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const testProps = {} as PropsWithVariant<"unknown">;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testNoStatusIsExcludedPerDefault() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const testProps = {
    variant: "success",
  } as PropsWithVariant;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testUnknownStatusVariantCanNotBeAssigned() {
  // @ts-expect-error Is unknown
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const testProps = {
    variant: "unknown",
  } as PropsWithVariant;
}
