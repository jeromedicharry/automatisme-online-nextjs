import React from 'react';
import BlocIntroSmall from '../atoms/BlocIntroSmall';
import AccordionItem from '../Product/AccordionItem';
import { ReassuranceAccordionItemsProps } from '@/types/blocTypes';
import Container from '../container';

const BlocReassuranceAccordion = ({
  reassuranceAccordion,
}: {
  reassuranceAccordion: ReassuranceAccordionItemsProps;
}) => {
  if (
    !reassuranceAccordion ||
    !reassuranceAccordion.accordion ||
    reassuranceAccordion.accordion.length === 0
  )
    return null;

  return (
    <section className="mb-12 md:mb-16">
      <Container>
        <BlocIntroSmall
          title={reassuranceAccordion.title}
          subtitle={reassuranceAccordion.text}
        />
        <div className="bg-primary-light rounded-lg py-4 px-4 lg:px-0">
          <div className="lg:max-w-[828px] mx-auto xxl:max-w-[1128px]            ">
            {reassuranceAccordion.accordion.map((item, index) => (
              <AccordionItem
                key={index}
                title={item.label}
                pictoFromWP={item.picto?.node?.sourceUrl}
                noBorderBottom={
                  index === reassuranceAccordion.accordion.length - 1
                }
              >
                <div
                  className="wysiwyg"
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
              </AccordionItem>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default BlocReassuranceAccordion;
