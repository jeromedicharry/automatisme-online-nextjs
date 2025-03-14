import { FaqItemProps } from '@/types/Faq';
import React from 'react';
import ProductDetailAccordionItem from './ProductDetailAccordionItem';
import { ProCustomerSvg, QuestionMarkSvg } from '../SVG/Icons';

const ProductDetails = ({ faqItems }: { faqItems: FaqItemProps[] }) => {
  //todo gérer la marque du produit
  // todo gérer la catégorie la plus basse du produit
  return (
    <>
      <ProductDetailAccordionItem
        picto={<ProCustomerSvg />}
        title="Spécifications techniques"
      >
        <div
          className="text-sm leading-general wysiwyg"
          dangerouslySetInnerHTML={{
            __html: `<p>Spécifications techniques</p>`,
          }}
        />
      </ProductDetailAccordionItem>
      <ProductDetailAccordionItem
        picto={<ProCustomerSvg />}
        title="Garanties et assistance"
      >
        <div
          className="text-sm leading-general wysiwyg"
          dangerouslySetInnerHTML={{
            __html: `<p>Garanties et assistance: récupérer les infos sur la brand quand elle sera exposée sur le produit"</p>`,
          }}
        />
      </ProductDetailAccordionItem>

      <ProductDetailAccordionItem
        picto={<QuestionMarkSvg />}
        title="Questions fréquentes sur le produit"
      >
        {faqItems.map((item, key) => (
          <div key={key} className="mt-4 first:mt-0">
            <h3 className="font-bold mb-2 text-base leading-general">
              {item.title}
            </h3>
            <div
              className="text-sm leading-general"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </div>
        ))}
      </ProductDetailAccordionItem>
    </>
  );
};

export default ProductDetails;
