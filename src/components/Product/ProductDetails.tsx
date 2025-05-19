import React from 'react';
import { ProCustomerSvg, QuestionMarkSvg, ShieldSvg } from '../SVG/Icons';
import { ProductDocsProps, ProductFaqItemProps } from './ProductContent';
import AccordionItem from './AccordionItem';

import ProductDoc from './ProductDoc';

const ProductDetails = ({
  faqItems,
  productDocs,
}: {
  faqItems: ProductFaqItemProps[];
  productDocs: ProductDocsProps;
}) => {
  //todo gérer la marque du produit

  return (
    <>
      {productDocs && (productDocs.noticeTech || productDocs.productNotice) && (
        <AccordionItem
          picto={<ProCustomerSvg />}
          title="Spécifications techniques"
        >
          <div className="space-y-3">
            {productDocs.noticeTech && (
              <ProductDoc
                title="Notice technique"
                buttonLabel="Consulter la notice"
                link={productDocs.noticeTech.node.mediaItemUrl}
              />
            )}
            {productDocs.productNotice && (
              <ProductDoc
                title={"Notice d'installation"}
                link={productDocs.productNotice.node.mediaItemUrl}
                buttonLabel={'Consulter la notice'}
              />
            )}
          </div>
        </AccordionItem>
      )}
      <AccordionItem picto={<ShieldSvg />} title="Garanties et assistance">
        <div
          className="text-sm leading-general wysiwyg"
          dangerouslySetInnerHTML={{
            __html: `<p>Garanties et assistance: récupérer les infos sur la brand quand elle sera exposée sur le produit"</p>`,
          }}
        />
      </AccordionItem>
      {faqItems?.length > 0 && (
        <AccordionItem
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
        </AccordionItem>
      )}
    </>
  );
};

export default ProductDetails;
