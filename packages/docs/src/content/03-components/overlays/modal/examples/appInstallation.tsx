import { useOverlayController } from "@mittwald/flow-react-components/controller";
import Button from "@mittwald/flow-react-components/Button";
import { Modal } from "@mittwald/flow-react-components/Modal";
import { Content } from "@mittwald/flow-react-components/Content";
import { Text } from "@mittwald/flow-react-components/Text";
import { Initials } from "@mittwald/flow-react-components/Initials";
import { Avatar } from "@mittwald/flow-react-components/Avatar";
import List, {
  ListItem,
  ListItemView,
  ListStaticData,
} from "@mittwald/flow-react-components/List";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { ActionGroup } from "@mittwald/flow-react-components/ActionGroup";
import { sleepLong } from "@/content/03-components/actions/action/examples/lib";
import { Action } from "@mittwald/flow-react-components/Action";

export default () => {
  const appSelectionController = useOverlayController();
  const configurationController = useOverlayController();

  interface App {
    name: string;
    description: string;
    versions: string;
  }

  const apps: App[] = [
    {
      name: "WordPress",
      description:
        "Eins der meist genutzten CMS. Perfekt für Blogs und Websites.",
      versions: "Versionen X.XX bis X.XX",
    },
    {
      name: "TYPO3",
      description:
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod",
      versions: "Versionen X.XX bis X.XX",
    },
    {
      name: "Joomla!",
      description:
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod",
      versions: "Versionen X.XX bis X.XX",
    },
  ];

  return (
    <>
      <Button
        color="accent"
        onPress={appSelectionController.open}
      >
        App installieren
      </Button>
      <Modal
        offCanvas
        controller={appSelectionController}
        size="l"
      >
        <Content>
          <List batchSize={5}>
            <ListStaticData data={apps} />
            <ListItemView<App>>
              {(app: App) => (
                <ListItem
                  onPress={appSelectionController.close}
                >
                  <Avatar>
                    <Initials>app.name</Initials>
                  </Avatar>
                  <Heading>{app.name}</Heading>
                  <Text>{app.versions}</Text>
                  <Content>{app.description}</Content>
                </ListItem>
              )}
            </ListItemView>
          </List>
        </Content>
        <ActionGroup>
          <Action closeOverlay>
            <Button variant="soft" color="secondary">
              Abbrechen
            </Button>
          </Action>
        </ActionGroup>
      </Modal>
    </>
  );
};
