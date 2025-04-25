import React from 'react';
import dynamic from 'next/dynamic';
import {
  BlocType,
  CardConseilProps,
  FeaturedFaqProps,
  ReassuranceAccordionItemsProps,
  ReassuranceItemProps,
} from '@/types/blocTypes';
import BlocFeaturedCategories from './blocs/BlocFeaturedCategories';
import BlocFeaturedProducts from './blocs/BlocFeaturedProducts';
import BlocConseilFAQ from './blocs/BlocConseilFAQ';
import BlocAnchorsPicto from './blocs/BlocAnchorsPicto';
import BlocQuestions from './blocs/BlocQuestions';
import BlocArticle from './blocs/BlocArticle';
import BlocFaq from './blocs/BlocFaq';
import { FaqItemProps } from '@/types/Faq';
import BlocVideo from './blocs/BlocVideo';
import BlocMosaique from './blocs/BlocMosaique';
import BlocReassuranceAccordion from './BlocReassuranceAccordion';
const BlocWysiwyg = dynamic(() => import('./blocs/BlocWysiwyg'));
const BlocSpacer = dynamic(() => import('./blocs/BlocSpacer'));
const BlocReassurance = dynamic(() => import('./blocs/BlocReassurance'));

interface FlexibleContentProps {
  blocs: BlocType[];
  reassuranceItems: ReassuranceItemProps[];
  reassuranceAccordion: ReassuranceAccordionItemsProps;
  genericAdvices: CardConseilProps[];
  featuredFaq: FeaturedFaqProps;
  faqItems: FaqItemProps[];
}

const FlexibleContent: React.FC<FlexibleContentProps> = ({
  blocs,
  reassuranceItems,
  reassuranceAccordion,
  genericAdvices,
  featuredFaq,
  faqItems,
}) => {
  if (blocs === null || blocs?.length === 0 || blocs === undefined) return null;

  return blocs.map((bloc: any, key: number) => {
    switch (bloc.__typename) {
      case 'AcfPageBlocsBlocWysiwygLayout':
        return <BlocWysiwyg key={key} bloc={bloc} />;
      case 'AcfPageBlocsBlocSpacerLayout':
        return <BlocSpacer key={key} bloc={bloc} />;
      case 'AcfPageBlocsBlocReassuranceLayout':
        return (
          <BlocReassurance
            key={key}
            bloc={bloc}
            reassuranceItems={reassuranceItems}
          />
        );
      case 'AcfPageBlocsBlocFeaturedCategoriesLayout':
        return <BlocFeaturedCategories key={key} bloc={bloc} />;
      case 'AcfPageBlocsBlocFeaturedProductsLayout':
        return <BlocFeaturedProducts key={key} bloc={bloc} />;
      case 'AcfPageBlocsBlocConseilsFaqLayout':
        return (
          <BlocConseilFAQ
            key={key}
            bloc={bloc}
            genericAdvices={genericAdvices}
            featuredFaq={featuredFaq}
          />
        );
      case 'AcfPageBlocsBlocPictosAnchorLinksLayout':
        return <BlocAnchorsPicto key={key} bloc={bloc} />;
      case 'AcfPageBlocsBlocDoubleCtaLayout':
        return <BlocQuestions key={key} bloc={bloc} />;
      case 'AcfPageBlocsBlocArticleLayout':
        return <BlocArticle key={key} bloc={bloc} />;
      case 'AcfPageBlocsBlocFaqLayout':
        return <BlocFaq key={key} bloc={bloc} faqItems={faqItems} />;
      case 'AcfPageBlocsBlocVideoLayout':
        return <BlocVideo key={key} bloc={bloc} />;
      case 'AcfPageBlocsBlocMosaique3ImagesLayout':
        return <BlocMosaique key={key} bloc={bloc} />;
      case 'AcfPageBlocsBlocAccordionLayout':
        return bloc?.isShown ? (
          <BlocReassuranceAccordion
            key={key}
            reassuranceAccordion={reassuranceAccordion}
          />
        ) : null;

      default:
        return null;
    }
  });
};

export default FlexibleContent;
