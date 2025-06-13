import React from 'react';
import Container from '../container';

const BlocIntroLarge = ({
  title,
  isH1 = false,
  subtitle,
  isDescriptionFontNormal = false,
}: {
  title: string;
  isH1?: boolean;
  subtitle?: string;
  isDescriptionFontNormal?: boolean;
}) => {
  if (!title && !subtitle) return null;
  return (
    <Container>
      <div className="flex flex-col items-center justify-center gap-4 mb-12 md:mb-10">
        {title && isH1 ? (
          <h1 className="text-4xl md:text-5xl font-bold leading-general text-center text-balance">
            {title}
          </h1>
        ) : (
          <h2 className="text-4xl md:text-5xl font-bold leading-general text-center text-balance">
            {title}
          </h2>
        )}
        {subtitle && (
          <div
            className={`text-xl text-center leading-general wysiwyg ${isDescriptionFontNormal ? 'font-normal' : 'font-medium'}`}
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        )}
      </div>
    </Container>
  );
};

export default BlocIntroLarge;
