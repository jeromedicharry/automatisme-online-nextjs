import { QuestionCtaCardProps } from '@/types/blocTypes';
import Image from 'next/image';
import React from 'react';
import { Wifi } from '../SVG/Icons';
import Cta from '../atoms/Cta';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/utils/constants/PLACHOLDERS';

const CardQuestionCta = ({ question }: { question: QuestionCtaCardProps }) => {
  // todo mobile
  return (
    <div className="flex rounded-2xl overflow-hidden max-w-[520px]">
      <Image
        src={question?.image?.node?.sourceUrl || PRODUCT_IMAGE_PLACEHOLDER}
        alt={question.subtitle}
        width={520}
        height={480}
        className="w-1/2 object-cover shrink-1"
      />
      <div className="bg-secondary-light relative p-8 w-1/2 overflow-hidden flex flex-col justify-between">
        <div className="absolute bottom-[-6px] left-[-6px] w-1/2 rotate-90">
          <Wifi variant="orange" />
        </div>
        <div className="relative">
          <div className="font-medium text-xl leading-general">
            {question.title}
          </div>
          <em className="font-medium text-secondary text-xl leading-general">
            {question.subtitle}
          </em>
        </div>
        {question?.isPhone ? (
          <Cta
            label={question.subtitle}
            slug={`tel:${question.phone}`}
            size="default"
            variant="secondary"
            additionalClass="relative"
          >
            <PhoneSvg /> {question.phone}
          </Cta>
        ) : (
          <Cta
            label={question.label}
            slug={question.slug}
            size="default"
            variant="secondary"
            additionalClass="relative"
          >
            {question.label}
          </Cta>
        )}
      </div>
    </div>
  );
};

export default CardQuestionCta;

export const PhoneSvg = () => {
  return (
    <svg
      width="21"
      height="17"
      viewBox="0 0 21 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.0092 8.83822V7.69872C18.0092 3.72331 14.6471 0.5 10.5005 0.5C6.35394 0.5 2.99183 3.72331 2.99183 7.69872V8.83822C0.883022 9.72803 -0.0735251 12.0888 0.854604 14.1105C1.51913 15.5572 3.01078 16.4939 4.66026 16.4985C5.58208 16.4985 6.32866 15.7827 6.32866 14.8989V10.1003C6.32866 9.21654 5.58208 8.50076 4.66026 8.50076V7.70022C4.66026 4.60857 7.27418 2.10105 10.5005 2.10105C13.7269 2.10105 16.3408 4.60706 16.3408 7.70022V8.50076C15.419 8.50076 14.6724 9.21654 14.6724 10.1003V14.8989H12.1689C11.708 14.8989 11.334 15.2576 11.334 15.6995C11.334 16.1414 11.708 16.5 12.1689 16.5H16.3408C18.6453 16.4939 20.5063 14.6977 20.5 12.4883C20.4952 10.9069 19.5182 9.47683 18.0092 8.83973V8.83822ZM4.66026 14.8974C3.27754 14.8974 2.15682 13.823 2.15682 12.4973C2.15682 11.1717 3.27754 10.0973 4.66026 10.0973V14.8959V14.8974ZM16.3392 14.8974V10.0988C17.7219 10.0988 18.8426 11.1732 18.8426 12.4989C18.8426 13.8245 17.7219 14.8989 16.3392 14.8989V14.8974Z"
        fill="white"
      />
    </svg>
  );
};
