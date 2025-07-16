import { useState, useRef, useEffect } from 'react';
import { Chevron } from '@/components/SVG/Icons';

interface FooterMenuItem {
  label: string;
  uri: string | null;
  childItems?: {
    nodes: {
      label: string;
      uri: string;
    }[];
  };
}

interface FooterAccordionProps {
  menuItems: FooterMenuItem[];
}

const FooterAccordion = ({ menuItems }: FooterAccordionProps) => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [contentHeights, setContentHeights] = useState<number[]>([]);

  useEffect(() => {
    const heights = menuItems.map((_, index) => {
      const content = contentRefs.current[index];
      return content?.scrollHeight ?? 0;
    });
    setContentHeights(heights);
  }, [menuItems]);

  const toggleAccordion = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <div className="w-full">
      {menuItems.map((item, index) => (
        <div key={index} className="border-b border-white">
          <button
            className="w-full flex items-center justify-between py-4 text-white hover:text-secondary transition-colors"
            onClick={() => toggleAccordion(index)}
          >
            <span>{item.label}</span>
            <div
              className={`h-2 w-2 flex items-center duration-300 ${openItems.includes(index) ? 'rotate-90' : '-rotate-90'}`}
            >
              <Chevron />
            </div>
          </button>
          {item.childItems && (
            <div
              ref={(el: HTMLDivElement | null) => {
                contentRefs.current[index] = el;
              }}
              style={{
                height: openItems.includes(index)
                  ? `${contentHeights[index]}px`
                  : '0',
                opacity: openItems.includes(index) ? 1 : 0,
              }}
              className="overflow-hidden transition-all duration-300 ease-in-out"
            >
              <div className="pb-2 grid grid-cols-1 gap-3 lg:grid-cols-2 xxl:grid-cols-3">
                {item.childItems.nodes.map((child, childIndex) => (
                  <a
                    key={childIndex}
                    href={child.uri}
                    className="block pl-4 text-white hover:text-secondary transition-colors"
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FooterAccordion;
