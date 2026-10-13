import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import { page } from "vitest/browser";

interface Jedi {
  id: string;
  name: string;
}

const jedis: Jedi[] = [
  { id: "1", name: "Luke Skywalker" },
  { id: "2", name: "Obi-Wan Kenobi" },
];

/*
 * `List` is not `@flr-generate`: in an extension it renders inside the iframe,
 * and the host only receives the grid or table it emits — behind the
 * `ClearPropsContext` every UI component sets. A props context keyed on `List`
 * therefore only covers `Local`.
 */
test.each(testEnvironments)(
  "a list in a section is labelled by the section heading (%s)",
  async ({ render, components: { Section, Heading, typedList, Text } }) => {
    const JediList = typedList<Jedi>();

    await render(
      <Section>
        <Heading>Jedi Council</Heading>
        <JediList.List batchSize={5}>
          <JediList.StaticData data={jedis} />
          <JediList.Item textValue={(jedi) => jedi.name}>
            {(jedi) => (
              <JediList.ItemView>
                <Heading>{jedi.name}</Heading>
              </JediList.ItemView>
            )}
          </JediList.Item>
        </JediList.List>
        <Text>Briefing</Text>
      </Section>,
    );

    await expect
      .element(page.getByRole("grid", { name: "Jedi Council" }))
      .toBeVisible();
  },
);

test.each(testEnvironments)(
  "a list table in a section is labelled by the section heading (%s)",
  async ({ render, components: { Section, Heading, typedList } }) => {
    const JediList = typedList<Jedi>();

    await render(
      <Section>
        <Heading>Jedi Council</Heading>
        <JediList.List batchSize={5} defaultViewMode="table">
          <JediList.StaticData data={jedis} />
          <JediList.Table>
            <JediList.TableHeader>
              <JediList.TableColumn>Name</JediList.TableColumn>
            </JediList.TableHeader>
            <JediList.TableBody>
              <JediList.TableRow>
                <JediList.TableCell>{(jedi) => jedi.name}</JediList.TableCell>
              </JediList.TableRow>
            </JediList.TableBody>
          </JediList.Table>
        </JediList.List>
      </Section>,
    );

    await expect
      .element(page.getByRole("grid", { name: "Jedi Council" }))
      .toBeVisible();
  },
);

test.each(testEnvironments)(
  "an explicit list label wins over the section heading (%s)",
  async ({ render, components: { Section, Heading, typedList } }) => {
    const JediList = typedList<Jedi>();

    await render(
      <Section>
        <Heading>Jedi Council</Heading>
        <JediList.List batchSize={5} aria-label="Masters">
          <JediList.StaticData data={jedis} />
          <JediList.Item textValue={(jedi) => jedi.name}>
            {(jedi) => (
              <JediList.ItemView>
                <Heading>{jedi.name}</Heading>
              </JediList.ItemView>
            )}
          </JediList.Item>
        </JediList.List>
      </Section>,
    );

    await expect
      .element(page.getByRole("grid", { name: "Masters" }))
      .toBeVisible();
  },
);

test.each(testEnvironments)(
  "a list in a modal is not labelled by the section around the modal (%s)",
  async ({
    render,
    components: { Section, Heading, typedList, Modal, Content },
  }) => {
    const JediList = typedList<Jedi>();

    await render(
      <Section>
        <Heading>Jedi Council</Heading>
        <Modal isDefaultOpen>
          <Heading>Pick a Jedi</Heading>
          <Content>
            <JediList.List batchSize={5}>
              <JediList.StaticData data={jedis} />
              <JediList.Item textValue={(jedi) => jedi.name}>
                {(jedi) => (
                  <JediList.ItemView>
                    <Heading>{jedi.name}</Heading>
                  </JediList.ItemView>
                )}
              </JediList.Item>
            </JediList.List>
          </Content>
        </Modal>
      </Section>,
    );

    const grid = page.getByRole("grid");
    await expect.element(grid).toBeVisible();
    expect(grid.element().getAttribute("aria-labelledby")).toBeNull();
  },
);

test.each(testEnvironments)(
  "a list in a section without a heading references no missing id (%s)",
  async ({ render, components: { Section, Heading, typedList, Text } }) => {
    const JediList = typedList<Jedi>();

    await render(
      <Section>
        <Text>Briefing</Text>
        <JediList.List batchSize={5}>
          <JediList.StaticData data={jedis} />
          <JediList.Item textValue={(jedi) => jedi.name}>
            {(jedi) => (
              <JediList.ItemView>
                <Heading>{jedi.name}</Heading>
              </JediList.ItemView>
            )}
          </JediList.Item>
        </JediList.List>
      </Section>,
    );

    const grid = page.getByRole("grid");
    await expect.element(grid).toBeVisible();
    expect(grid.element().getAttribute("aria-labelledby")).toBeNull();
  },
);

test.each(testEnvironments)(
  "a section heading with its own id does not label the list (%s)",
  async ({ render, components: { Section, Heading, typedList } }) => {
    const JediList = typedList<Jedi>();

    await render(
      <Section>
        <Heading id="council">Jedi Council</Heading>
        <JediList.List batchSize={5}>
          <JediList.StaticData data={jedis} />
          <JediList.Item textValue={(jedi) => jedi.name}>
            {(jedi) => (
              <JediList.ItemView>
                <Heading>{jedi.name}</Heading>
              </JediList.ItemView>
            )}
          </JediList.Item>
        </JediList.List>
      </Section>,
    );

    const grid = page.getByRole("grid");
    await expect.element(grid).toBeVisible();
    expect(grid.element().getAttribute("aria-labelledby")).toBeNull();
  },
);

test.each(testEnvironments)(
  "a list in an accordion is not labelled by the section around it (%s)",
  async ({
    render,
    components: { Section, Heading, typedList, Accordion, Content },
  }) => {
    const JediList = typedList<Jedi>();

    await render(
      <Section>
        <Heading>Jedi Council</Heading>
        <Accordion defaultExpanded>
          <Heading>Padawans</Heading>
          <Content>
            <JediList.List batchSize={5}>
              <JediList.StaticData data={jedis} />
              <JediList.Item textValue={(jedi) => jedi.name}>
                {(jedi) => (
                  <JediList.ItemView>
                    <Heading>{jedi.name}</Heading>
                  </JediList.ItemView>
                )}
              </JediList.Item>
            </JediList.List>
          </Content>
        </Accordion>
      </Section>,
    );

    const grid = page.getByRole("grid");
    await expect.element(grid).toBeVisible();
    expect(grid.element().getAttribute("aria-labelledby")).toBeNull();
  },
);
