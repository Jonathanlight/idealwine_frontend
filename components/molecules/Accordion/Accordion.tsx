import {
  AccordionMultipleProps,
  AccordionSingleProps,
  Content,
  Header,
  Item,
  Root,
  Trigger,
} from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { forwardRef, ReactNode, Ref } from "react";

import styles from "./Accordion.module.scss";

export type Section = {
  title: string | ReactNode;
  content: string | ReactNode;
  value?: string;
};

type AccordionProps = {
  sections: Section[];
  rootStyle?: string;
  itemStyle?: string;
  headerStyle?: string;
  triggerStyle?: string;
  chevronStyle?: string;
  contentContainerStyle?: string;
  contentStyle?: string;
  setValue?: (value: unknown) => void;
} & (AccordionSingleProps | AccordionMultipleProps);

const Accordion = forwardRef(
  (
    {
      sections,
      rootStyle,
      itemStyle,
      headerStyle,
      triggerStyle,
      chevronStyle,
      contentContainerStyle,
      contentStyle,
      setValue,
      ...others
    }: AccordionProps,
    ref: Ref<HTMLButtonElement & HTMLDivElement>,
  ) => {
    return (
      <Root className={(styles.accordionRoot, rootStyle)} onValueChange={setValue} {...others}>
        {sections.map(({ title, content, value }, index) => (
          <Item
            className={clsx(styles.accordionItem, itemStyle)}
            key={index}
            value={value ?? `item-${index + 1}`}
          >
            <Header className={clsx(styles.accordionHeader, headerStyle)}>
              <Trigger className={clsx(styles.accordionTrigger, triggerStyle)} ref={ref}>
                {title}
                <ChevronDownIcon
                  className={clsx(styles.accordionChevron, chevronStyle)}
                  aria-hidden
                />
              </Trigger>
            </Header>
            <Content
              className={clsx(styles.accordionContentContainer, contentContainerStyle)}
              ref={ref}
            >
              <div className={contentStyle}>{content}</div>
            </Content>
          </Item>
        ))}
      </Root>
    );
  },
);

Accordion.displayName = "Accordion";

export default Accordion;
