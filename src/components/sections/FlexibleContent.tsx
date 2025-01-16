import React from 'react';
import dynamic from 'next/dynamic';
import { BlocType, ReassuranceItemProps } from '@/types/blocTypes';
const BlocWysiwyg = dynamic(() => import('./blocs/BlocWysiwyg'));
const BlocSpacer = dynamic(() => import('./blocs/BlocSpacer'));
const BlocReassurance = dynamic(() => import('./blocs/BlocReassurance'));

interface FlexibleContentProps {
  blocs: BlocType[];
  reassuranceItems: ReassuranceItemProps[];
}

const FlexibleContent: React.FC<FlexibleContentProps> = ({
  blocs,
  reassuranceItems,
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

      default:
        return null;
    }
  });
};

export default FlexibleContent;
