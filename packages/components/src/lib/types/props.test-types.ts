import { StatusVariantProps } from "@/lib/types/props";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testStatusVariantCanBeOmitted() {
  // @ts-expect-error "success" status is excluded
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const testProps = {
    variant: "success",
  } as StatusVariantProps<"success">;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testUnknownStatusVariantCanNotBeOmitted() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const testProps = {
    variant: "success",
    // @ts-expect-error Is unknown
  } as StatusVariantProps<"unknown">;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testNoStatusIsExcludedPerDefault() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const testProps = {
    variant: "success",
  } as StatusVariantProps;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testUnknownStatusVariantCanNotBeAssigned() {
  // @ts-expect-error Is unknown
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const testProps = {
    variant: "unknown",
  } as StatusVariantProps;
}
