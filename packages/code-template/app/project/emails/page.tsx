"use client";
import Tabs, { Tab, TabTitle } from "@mittwald/flow-react-components/Tabs";
import { Content } from "@mittwald/flow-react-components/Content";
import { ListItemView, typedList } from "@mittwald/flow-react-components/List";
import Avatar from "@mittwald/flow-react-components/Avatar";
import { IconEmail } from "@mittwald/flow-react-components/Icons";
import Heading from "@mittwald/flow-react-components/Heading";
import StatusBadge from "@mittwald/flow-react-components/StatusBadge";
import ProgressBar from "@mittwald/flow-react-components/ProgressBar";
import Text from "@mittwald/flow-react-components/Text";
import Label from "@mittwald/flow-react-components/Label";
import IllustratedMessage from "@mittwald/flow-react-components/IllustratedMessage";
import LayoutCard from "@mittwald/flow-react-components/LayoutCard";
import Breadcrumb from "@mittwald/flow-react-components/Breadcrumb";
import Link from "@mittwald/flow-react-components/Link";
import styles from "@/app/layout.module.scss";

export default function Page() {
  const EmailList = typedList<{
    email: string;
    storage: number;
  }>();

  return (
    <>
      <Breadcrumb color="light">
        <Link href="/project">Projekt</Link>
        <Link>E-Mail-Adressen</Link>
      </Breadcrumb>
      <Heading level={1} color="light">
        E-Mail-Adressen
      </Heading>
      <LayoutCard className={styles.content}>
        <Tabs>
          <Tab>
            <TabTitle>E-Mail-Adressen</TabTitle>
            <Content>
              <EmailList.List>
                <EmailList.StaticData
                  data={[
                    { email: "john@doe.de", storage: 80 },
                    { email: "max@mustermann.de", storage: 20 },
                  ]}
                />
                <EmailList.Search />
                <EmailList.Sorting
                  property="email"
                  name="A bis Z"
                  defaultEnabled
                />
                <EmailList.Sorting
                  property="email"
                  name="Z bis A"
                  direction="desc"
                />

                <EmailList.Item>
                  {(email) => (
                    <ListItemView>
                      <Avatar variant={1}>
                        <IconEmail />
                      </Avatar>
                      <Heading>
                        {email.email}
                        {email.storage >= 80 && (
                          <StatusBadge status="warning">
                            Speicher fast voll
                          </StatusBadge>
                        )}
                      </Heading>
                      <Text>
                        <ProgressBar
                          size="s"
                          value={email.storage}
                          status={email.storage >= 80 ? "warning" : "info"}
                        >
                          <Label>Speicherplatz</Label>
                        </ProgressBar>
                      </Text>
                    </ListItemView>
                  )}
                </EmailList.Item>
              </EmailList.List>
            </Content>
          </Tab>
          <Tab>
            <TabTitle>Postausgänge</TabTitle>
            <Content>
              <IllustratedMessage>
                <IconEmail />
                <Heading>Keine Postausgänge vorhanden</Heading>
                <Text>In deinem Projekt gibt es noch keine Postausgänge.</Text>
              </IllustratedMessage>
            </Content>
          </Tab>
        </Tabs>
      </LayoutCard>
    </>
  );
}
