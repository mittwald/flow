import {
  PropsWithElementType,
  PropsWithVariant,
  Variant,
} from "@/lib/types/props";

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testAssigningUnknownElementTypeThrowsError() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const test: PropsWithElementType<"div"> = {
    // @ts-expect-error Is unknown
    elementType: "foo",
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testAssigningElementTypeWorks() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const test: PropsWithElementType<"div"> = {
    elementType: "a",
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testAssigningUnsupportedElementPropsThrowsError() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const test: PropsWithElementType<"div"> = {
    elementType: "a",
    // @ts-expect-error Is not supported
    href: "link",
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testAssigningSupportedElementPropsWorks() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const test: PropsWithElementType<"a"> = {
    elementType: "div",
    href: "link",
  };
}
