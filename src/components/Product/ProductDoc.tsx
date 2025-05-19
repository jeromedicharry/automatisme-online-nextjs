import DownloadButton from '../atoms/DownloadButton';
import { InfoSvg } from '../SVG/Icons';

const ProductDoc = ({
  title,
  buttonLabel,
  link,
}: {
  title: string;
  buttonLabel: string;
  link: string;
}) => {
  return (
    <div className="flex justify-between items-center gap-6 text-dark-grey">
      <p>{title}</p>

      <div className="w-fit">
        <DownloadButton href={link} label={buttonLabel} variant="greyHollow">
          <div className="w-6 h-6 flex items-center">
            <InfoSvg />
          </div>
          {buttonLabel}
        </DownloadButton>
      </div>
    </div>
  );
};

export default ProductDoc;
