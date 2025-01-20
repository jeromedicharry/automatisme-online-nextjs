import { SpacerProps } from '@/types/blocTypes';
import React from 'react';

const BlocSpacer = ({ bloc }: { bloc: SpacerProps }) => {
  if (!bloc) return null;

  const heightMobile = bloc?.heightMobile ? `${bloc.heightMobile}px` : 'auto';
  const heightDesktop = bloc?.height ? `${bloc.height}px` : 'auto';

  return (
    <div
      style={{
        height: heightMobile,
      }}
    >
      <style jsx>{`
        @media (min-width: 768px) {
          div {
            height: ${heightDesktop};
          }
        }
      `}</style>
    </div>
  );
};

export default BlocSpacer;
