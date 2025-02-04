import { useState, useRef, useEffect } from 'react';
import { BulletSvg } from '../sections/blocs/BlocAnchorsPicto';

const ExpandableText = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(
        textRef.current.scrollHeight > textRef.current.clientHeight,
      );
    }
  }, [text]);

  return (
    <section>
      <div
        ref={textRef}
        className={`wysiwyg ${isExpanded ? '' : 'line-clamp-6'} overflow-hidden duration-300`}
        dangerouslySetInnerHTML={{ __html: text }}
      />

      {isTruncated && !isExpanded && (
        <button
          className="text-primary hover:text-primary-dark duration-300 flex gap-2 items-center font-bold group mt-4"
          onClick={() => setIsExpanded(true)}
        >
          Voir plus
          <div className="text-secondary rotate-90 group-hover:text-secondary-dark duration-300">
            <BulletSvg />
          </div>
        </button>
      )}
    </section>
  );
};

export default ExpandableText;
