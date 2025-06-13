import { useState, useRef, useEffect } from 'react';
import { BulletSvg } from '../sections/blocs/BlocAnchorsPicto';

type variant = 'primary' | 'grey';

const ExpandableText = ({
  text,
  variant = 'primary',
}: {
  text: string;
  variant?: variant;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const fullHeight = el.scrollHeight;

    // Calcul précis de la hauteur de 6 lignes
    const computedStyle = window.getComputedStyle(el);
    const lineHeight = parseFloat(computedStyle.lineHeight || '24'); // fallback 24px
    const sixLineHeight = lineHeight * 6;

    if (!isExpanded) {
      setMaxHeight(sixLineHeight);
      setIsTruncated(fullHeight > sixLineHeight + 1); // +1 pour marge d'erreur
    } else {
      setMaxHeight(fullHeight);
    }
  }, [text, isExpanded]);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <section>
      <div
        ref={contentRef}
        className={`wysiwyg transition-all duration-300 ease-in-out overflow-hidden ${
          variant === 'primary' ? 'text-primary' : 'text-dark-grey'
        }`}
        style={{ maxHeight }}
        dangerouslySetInnerHTML={{ __html: text }}
      />

      {isTruncated && (
        <button
          className="text-primary hover:text-primary-dark transition-colors duration-300 flex gap-2 items-center font-bold group mt-4"
          onClick={toggleExpand}
        >
          {isExpanded ? 'Voir moins' : 'Voir plus'}
          <div
            className={`text-secondary transform transition-transform duration-300 ${
              isExpanded ? '-rotate-90' : 'rotate-90'
            } group-hover:text-secondary-dark`}
          >
            <BulletSvg />
          </div>
        </button>
      )}
    </section>
  );
};

export default ExpandableText;
