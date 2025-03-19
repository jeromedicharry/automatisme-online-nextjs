import React from 'react';
import { Chevron } from '../SVG/Icons';

export type TabType =
  | 'orders'
  | 'favorites'
  | 'addresses'
  | 'profile'
  | 'help'
  | 'pro';

interface TabLinkProps {
  id: TabType;
  linkName: string;
  picto: React.ReactNode;
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
  setMobileNavClosed: React.Dispatch<React.SetStateAction<boolean>>;
}

const TabLink = ({
  id,
  linkName,
  picto,
  activeTab,
  setActiveTab,
  setMobileNavClosed,
}: TabLinkProps) => {
  return (
    <li className="pb-3 border-b last:border-b-0 border-breadcrumb-grey min-w-[230px]">
      <button
        onClick={() => {
          setActiveTab(id);
          setMobileNavClosed(true);
        }}
        className={`w-full gap-3 font-bold flex items-center duration-300 justify-between ${activeTab === id ? 'text-secondary' : 'hover:opacity-80'}`}
      >
        <div className="flex gap-[10px] items-center">
          <div className="w-6">{picto} </div> {linkName}
        </div>
        <div className="rotate-180">
          <Chevron />
        </div>
      </button>
    </li>
  );
};

export default TabLink;
