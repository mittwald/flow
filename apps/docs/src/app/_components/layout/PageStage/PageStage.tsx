import type { CSSProperties, FC, ReactNode } from "react";
import { Flex, Heading, Text } from "@mittwald/flow-react-components";
import { topAnchorId } from "@/lib/mdx/MdxFile";
import layoutStyles from "@/app/layout.module.scss";
import getStartedVisual from "../../../../../public/assets/home/get-started.webp";
import foundationsVisual from "../../../../../public/assets/home/foundations.webp";
import componentsVisual from "../../../../../public/assets/home/components.webp";
import templatesVisual from "../../../../../public/assets/home/templates.webp";
import releasesVisual from "../../../../../public/assets/home/releases.webp";
import styles from "./PageStage.module.scss";

/** Each section carries the visual of its tile on the homepage. */
export const sectionVisuals: Record<string, string> = {
  "get-started": getStartedVisual.src,
  foundations: foundationsVisual.src,
  components: componentsVisual.src,
  templates: templatesVisual.src,
  releases: releasesVisual.src,
};

interface Props {
  /** The line above the title, e.g. "Components · Actions". */
  eyebrow: string;
  title: string;
  description?: ReactNode;
  /** Key of `sectionVisuals`. */
  section: string;
  actions?: ReactNode;
}

/**
 * The dark page head in the mittwald.de look. It holds the page's `h1`, which
 * doubles as the "top of the page" anchor.
 */
export const PageStage: FC<Props> = (props) => {
  const { eyebrow, title, description, section, actions } = props;
  const visual = sectionVisuals[section];

  return (
    <header
      className={styles.stage}
      style={visual ? ({ "--visual": `url(${visual})` } as CSSProperties) : {}}
    >
      <Flex direction="column" gap="m" className={styles.stageContent}>
        <Text className={styles.eyebrow}>{eyebrow}</Text>
        <Heading
          level={1}
          id={topAnchorId}
          color="light-static"
          className={`${layoutStyles.pageHeading} ${styles.title}`}
        >
          {title}
        </Heading>
        {description && (
          <Text elementType="p" className={styles.description}>
            {description}
          </Text>
        )}
      </Flex>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
};

export default PageStage;
