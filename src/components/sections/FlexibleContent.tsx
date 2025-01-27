import React from 'react';
import dynamic from 'next/dynamic';
import {
  BlocType,
  CardConseilProps,
  FeaturedFaqProps,
  ReassuranceItemProps,
} from '@/types/blocTypes';
import BlocFeaturedCategories from './blocs/BlocFeaturedCategories';
import BlocFeaturedProducts from './blocs/BlocFeaturedProducts';
import BlocConseilFAQ from './blocs/BlocConseilFAQ';
import BlocAnchorsPicto from './blocs/BlocAnchorsPicto';
import BlocQuestions from './blocs/BlocQuestions';
const BlocWysiwyg = dynamic(() => import('./blocs/BlocWysiwyg'));
const BlocSpacer = dynamic(() => import('./blocs/BlocSpacer'));
const BlocReassurance = dynamic(() => import('./blocs/BlocReassurance'));

interface FlexibleContentProps {
  blocs: BlocType[];
  reassuranceItems: ReassuranceItemProps[];
  genericAdvices: CardConseilProps[];
  featuredFaq: FeaturedFaqProps;
}

const FlexibleContent: React.FC<FlexibleContentProps> = ({
  blocs,
  reassuranceItems,
  genericAdvices,
  featuredFaq,
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

      default:
        return null;
    }
  });
};

export default FlexibleContent;
