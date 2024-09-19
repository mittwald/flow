"use client";
import Avatar from "@mittwald/flow-react-components/Avatar";
import Heading from "@mittwald/flow-react-components/Heading";
import Initials from "@mittwald/flow-react-components/Initials";
import { ListItemView, typedList } from "@mittwald/flow-react-components/List";
import Section from "@mittwald/flow-react-components/Section";
import Text from "@mittwald/flow-react-components/Text";
import styles from "@/app/layout.module.scss";
import Breadcrumb from "@mittwald/flow-react-components/Breadcrumb";
import Link from "@mittwald/flow-react-components/Link";
import LayoutCard from "@mittwald/flow-react-components/LayoutCard";

export default function Page() {
  const MemberList = typedList<{ name: string; email: string }>();

  return (
    <>
      <Breadcrumb color="light">
        <Link href="/customer">Organisation</Link>
        <Link>Mitglieder</Link>
      </Breadcrumb>
      <Heading level={1} color="light">
        Mitglieder
      </Heading>
      <LayoutCard className={styles.content}>
        <Section>
          <MemberList.List>
            <MemberList.StaticData
              data={[
                { name: "John Doe", email: "john@doe.de" },
                { name: "Max Mustermann", email: "max@mustermann.de" },
                { name: "Franz Müller", email: "f.mueller@mittwald.de" },
              ]}
            />
            <MemberList.Search />
            <MemberList.Sorting property="name" name="A bis Z" defaultEnabled />
            <MemberList.Sorting
              property="name"
              name="Z bis A"
              direction="desc"
            />

            <MemberList.Item>
              {(member) => (
                <ListItemView>
                  <Avatar>
                    <Initials>{member.name}</Initials>
                  </Avatar>
                  <Heading>{member.name}</Heading>
                  <Text>{member.email}</Text>
                </ListItemView>
              )}
            </MemberList.Item>
          </MemberList.List>
        </Section>
      </LayoutCard>
    </>
  );
}
