import BlocIntroLarge from '@/components/atoms/BlocIntroLarge';
import React from 'react';

const SimpleHero = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return <BlocIntroLarge title={title} subtitle={subtitle} isH1 />;
};

export default SimpleHero;
