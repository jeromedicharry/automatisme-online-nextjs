import React, { ReactNode } from 'react';

export interface DoofinderProviderProps {
  children: ReactNode;
  clientType?: string;
}

declare const DoofinderProvider: React.FC<DoofinderProviderProps>;
export default DoofinderProvider;
