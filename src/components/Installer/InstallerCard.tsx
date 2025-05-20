import Cta from '../atoms/Cta';
import { Wifi } from '../SVG/Icons';

export interface InstallerCardProps {
  id: string;
  title: string;
  address: string;
  distance?: number;
  phone?: string;
  email?: string;
  variant?: 'list' | 'map';
}

const InstallerCard = ({
  id,
  title,
  address,
  distance,
  phone,
  email,
  variant = 'list',
}: InstallerCardProps) => {
  return (
    <div
      className={`relative z-0 py-4 px-2 bg-primary-light-alt rounded-2xl overflow-hidden transition-shadow h-full flex flex-col ${variant === 'map' ? 'shadow-card pt-8 max-w-[196px]' : ''}`}
    >
      {variant === 'list' && (
        <div className="absolute max-w-[105px] bottom-[-3px] left-[-3px] rotate-90 z-[-1]">
          <Wifi variant="bleu2" />
        </div>
      )}
      <h3
        className={`font-semibold ${variant === 'map' ? 'text-sm mb-2' : 'text-xl mb-8'} leading-general`}
      >
        {title}
      </h3>
      <div
        className={`text-dark-grey ${variant === 'map' ? 'mb-8 text-sm leading-general' : 'mb-4'}`}
        dangerouslySetInnerHTML={{ __html: address }}
      />
      {phone && (
        <p className="text-sm leading-general text-dark-grey mb-1">
          <a href={`tel:${phone}`}>{phone}</a>
        </p>
      )}
      {email && (
        <p className="text-sm leading-general text-dark-grey mb-2 duration-300 hover:text-secondary">
          <a href={`mailto:${email}`}>{email}</a>
        </p>
      )}
      {distance !== undefined && variant === 'list' && (
        <p className="text-sm text-dark-grey mb-4">
          Distance: {Math.round(distance * 10) / 10} km
        </p>
      )}
      <div className="mt-auto">
        <Cta
          label="Choisir"
          slug={`/devis?installerId=${id}`}
          size="default"
          variant="primary"
          isFull
        >
          Choisir
        </Cta>
      </div>
    </div>
  );
};

export default InstallerCard;
