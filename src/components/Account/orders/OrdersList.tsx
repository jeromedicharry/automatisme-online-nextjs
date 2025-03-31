import Cta from '@/components/atoms/Cta';
import { Chevron } from '@/components/SVG/Icons';
import { OrderProps } from '@/types/orderTypes';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/utils/constants/PLACHOLDERS';
import { formatDate, GetStatusName } from '@/utils/functions/functions';
import Image from 'next/image';
import React from 'react';

const OrdersList = ({ orders }: { orders: OrderProps[] }) => {
  // todo gérer la page de détail et le suivi de commande
  // todo gérer le retour d'un article
  return (
    <div className="flex flex-col gap-6 text-sm">
      {orders.map((order) => (
        <div
          key={order.orderNumber}
          className="py-2 px-4 md:px-5 md:py-3 bg-white rounded-lg shadow-card flex gap-6 flex-col lg:flex-row lg:justify-between"
        >
          <div className="w-full lg:max-w-[70%]">
            <h3 className="text-primary mb-2 font-bold">
              N° de commande :{' '}
              <span className="text-secondary">{order.orderNumber}</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 md:flex md:gap-2 md:justify-between lg:gap-10 xxl:gap-24 mb-4 xxl:justify-start">
              <div>
                <strong>Date de la commande</strong>
                <p className="text-dark-grey">{formatDate(order.date)}</p>
              </div>
              <div>
                <strong>Statut de la commande</strong>
                <p className="text-dark-grey">
                  {GetStatusName(order?.status || '')}
                </p>
              </div>
              <div>
                <strong>Total TTC</strong>
                <p className="text-dark-grey">{order.total} €</p>
              </div>
            </div>
            {order.lineItems?.nodes?.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {order.lineItems?.nodes?.map(({ product }, key) =>
                  !product ? (
                    <div key={`deleted-${key}`} className="w-[200px]">
                      <Image
                        src={PRODUCT_IMAGE_PLACEHOLDER}
                        alt="Produit supprimé"
                        width={100}
                        height={100}
                        className="block mx-auto w-[150px] h-[150px] object-contain"
                      />
                      <div>
                        <strong className="block whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                          {"Ce produit n'existe plus"}
                        </strong>
                        <p className="text-dark-grey">
                          {'Référence supprimée'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div key={product?.node?.sku} className="w-[200px]">
                      <Image
                        src={
                          product.node.featuredImage.node.sourceUrl ||
                          PRODUCT_IMAGE_PLACEHOLDER
                        }
                        alt={product.node.name}
                        width={100}
                        height={100}
                        className="block mx-auto w-[150px] h-[150px] object-contain"
                      />
                      <div>
                        <strong className="block whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                          {product.node.name}
                        </strong>
                        <p className="text-dark-grey">{product.node.sku}</p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
          <div>
            <Cta
              label="Détails de la commande"
              handleButtonClick={() => {}}
              slug="#"
              size="small"
              variant="primaryHollow"
            >
              Détails de la commande
            </Cta>
            <a
              href="#"
              className="flex items-center justify-center gap-2 mt-2 text-secondary text-sm text-center duration-300 hover:text-primary"
            >
              Suivi de la commande{' '}
              <div className="w-1 h-1 flex items-center justify-center rotate-180">
                <Chevron />
              </div>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersList;
