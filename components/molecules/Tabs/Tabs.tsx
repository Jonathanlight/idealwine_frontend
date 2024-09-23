import * as RadixTabs from "@radix-ui/react-tabs";
import { ReactNode } from "react";

import styles from "./Tabs.module.scss";

type TabInfo = {
  title: string;
  content: ReactNode;
  key: string;
};

type Props = {
  tabs: TabInfo[];
  label: string;
};

const Tabs = ({ tabs, label }: Props): JSX.Element => {
  if (tabs.length === 0) {
    return <></>;
  }

  return (
    <RadixTabs.Root defaultValue={tabs[0].key} className={styles.container}>
      <RadixTabs.List aria-label={label} className={styles.titlesContainer}>
        {tabs.map(tabInfo => (
          <RadixTabs.Trigger value={tabInfo.key} key={tabInfo.key} className={styles.title}>
            {tabInfo.title}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {tabs.map(tabInfo => (
        <RadixTabs.Content value={tabInfo.key} key={tabInfo.key} className={styles.content}>
          {tabInfo.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
};

export default Tabs;
