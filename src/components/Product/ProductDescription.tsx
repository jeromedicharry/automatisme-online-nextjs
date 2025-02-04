import React from 'react';
import ExpandableText from '../atoms/ExpandableText';

const ProductDescription = ({ description }: { description: string }) => {
  return <ExpandableText text={description} />;
};

export default ProductDescription;
