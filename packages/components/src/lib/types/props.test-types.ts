import type {
  PropsWithElementType,
  PropsWithStatus,
  Status,
} from "@/lib/types/props";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testStatusCanBeOmitted() {
  // @ts-expect-error "success" status is excluded
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const testProps = {
    status: "success",
  } as PropsWithStatus<Exclude<Status, "success">>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testUnknownStatusCanNotBeOmitted() {
  // @ts-expect-error Is unknown
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const testProps = {} as PropsWithStatus<"unknown">;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testNoStatusIsExcludedPerDefault() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const testProps = {
    status: "success",
  } as PropsWithStatus;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testUnknownStatusCanNotBeAssigned() {
  // @ts-expect-error Is unknown
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const testProps = {
    status: "unknown",
  } as PropsWithStatus;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testAssigningUnknownElementTypeThrowsError() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const test: PropsWithElementType = {
    // @ts-expect-error Is unknown
    elementType: "foo",
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testAssigningElementTypeWorks() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const test: PropsWithElementType<"a"> = {
    elementType: "a",
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testAssigningUnsupportedElementPropsThrowsError() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const test: PropsWithElementType<"a"> = {
    elementType: "a",
    // @ts-expect-error Is not supported
    href: "link",
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testAssigningSupportedElementPropsWorks() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const test: PropsWithElementType<"a"> = {
    elementType: "a",
    title: "Hello!",
  };
}
