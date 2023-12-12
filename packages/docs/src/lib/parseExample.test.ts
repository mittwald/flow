import parseExample from "./parseExample";

const functionExample = `import { Button } from "@mittwald/flow-components/Button";

export default function DefaultButton() {
  return (
    <>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="negative">Negative</Button>
    </>
  );
}`;

const arrowFunction = `import { Button } from "@mittwald/flow-components/Button";

export default () => <>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="negative">Negative</Button>
</>`;

const topLevel = `import { Button } from "@mittwald/flow-components/Button";

<>
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="accent">Accent</Button>
  <Button variant="negative">Negative</Button>
</>`;

const defaultExportStatement = `import { Button } from "@mittwald/flow-components/Button";

export default <>
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="accent">Accent</Button>
  <Button variant="negative">Negative</Button>
</>`;

const topLevelArrowFunction = `import { Button } from "@mittwald/flow-components/Button";

() => <>
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="accent">Accent</Button>
  <Button variant="negative">Negative</Button>
</>`;

const topLevelFunction = `import { Button } from "@mittwald/flow-components/Button";

function topLevel() { 
  return <>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="accent">Accent</Button>
    <Button variant="negative">Negative</Button>
  </>
}`;

const expectedResult = `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="accent">Accent</Button>
<Button variant="negative">Negative</Button>`;

describe("Parse Example", () => {
  it("Function", () => {
    expect(parseExample(functionExample)).toBe(expectedResult);
  });
  it("Arrow Function", () => {
    expect(parseExample(arrowFunction)).toBe(expectedResult);
  });
  it("Top-Level", () => {
    expect(parseExample(topLevel)).toBe(expectedResult);
  });
  it("Default Export Statement", () => {
    expect(parseExample(defaultExportStatement)).toBe(expectedResult);
  });
  it("Top-Level Arrow Function", () => {
    expect(parseExample(topLevelArrowFunction)).toBe(expectedResult);
  });
  it("Top-Level Function", () => {
    expect(parseExample(topLevelFunction)).toBe(expectedResult);
  });
});
