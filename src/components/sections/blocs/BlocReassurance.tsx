import AvisVerifiesReassurance from '@/components/atoms/AvisVerifiesReassurance';
import Container from '@/components/container';
import { BlocReassuranceProps, ReassuranceItemProps } from '@/types/blocTypes';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const BlocReassurance = ({
  bloc,
  reassuranceItems,
  isFooter = false,
}: {
  bloc: BlocReassuranceProps;
  reassuranceItems: ReassuranceItemProps[];
  isFooter?: boolean;
}) => {
  if (!bloc || !reassuranceItems || reassuranceItems.length === 0) return null;

  const items = bloc.isAvis ? reassuranceItems.slice(0, 3) : reassuranceItems;
  const mobileBgColor =
    bloc.type === 'Fond bleu clair'
      ? 'max-md:bg-primary-light'
      : 'max-md:bg-white';
  const bgColor =
    bloc.type === 'Fond bleu clair' ? 'md:bg-primary-light' : 'md:bg-white';

  return (
    <Container>
      <section
        className={`w-full md:rounded-[13px] py-8 md:p-[10px] ${bgColor} ${isFooter ? '' : 'mb-12 md:mb-16'}`}
      >
        <div className="grid grid-cols-2 gap-4 max-md:max-w-md mx-auto md:flex justify-around">
          {items.map((item, index) => (
            <Link
              href={item?.link || ''}
              key={index}
              className="flex items-center gap-2 text-primary hover:text-primary-dark duration-300"
            >
              {item.picto?.node?.sourceUrl ? (
                <div
                  className={`flex rounded-[3px] ${mobileBgColor} px-[6px] py-[5px]`}
                >
                  <Image
                    src={item.picto.node.sourceUrl}
                    alt={item.label || 'Picto'}
                    width={100}
                    height={100}
                    className="w-6 max-w-6"
                  />
                </div>
              ) : null}
              <span className="text-[0.6875rem] underline text-balance">
                {item.label}
              </span>
            </Link>
          ))}
          {bloc.isAvis && <AvisVerifiesReassurance />}
        </div>
      </section>
    </Container>
  );
};

export default BlocReassurance;
