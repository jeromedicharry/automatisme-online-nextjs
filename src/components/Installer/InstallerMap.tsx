import React, { useState, useEffect } from 'react';
import { Map, Marker, Overlay } from 'pigeon-maps';
import InstallerCard from './InstallerCard';

interface Installer {
  databaseId: number;
  title: string;
  acfContent: {
    address: string;
    phone?: string;
    email?: string;
    geolocation: {
      latitude: number;
      longitude: number;
    };
  };
  distance?: number;
}

interface InstallerMapProps {
  installers: Installer[];
  center?: [number, number];
  activeCardIndex: number | null;
  setActiveCardIndex: (index: number | null) => void;
}

const InstallerMap: React.FC<InstallerMapProps> = ({
  installers,
  center = [46.603354, 1.888334], // Centre de la France par défaut
  activeCardIndex,
  setActiveCardIndex,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 940);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calcul du zoom en fonction des résultats
  const getZoomLevel = () => {
    if (installers.length === 0) return 6; // Vue de la France entière
    if (center[0] === 46.603354 && center[1] === 1.888334) return 6; // Centre par défaut
    return 9.5; // Zoom sur la ville recherchée
  };

  return (
    <div className="h-[370px] md:h-[670px] w-full">
      <Map center={center} zoom={getZoomLevel()} attribution={false}>
        {installers.map((installer, index) => (
          <Marker
            key={index}
            width={34}
            anchor={[
              installer.acfContent.geolocation.latitude,
              installer.acfContent.geolocation.longitude,
            ]}
            color="#E94E1B"
            onClick={() =>
              setActiveCardIndex(index === activeCardIndex ? null : index)
            }
          />
        ))}

        {activeCardIndex !== null && (
          <Overlay
            anchor={[
              installers[activeCardIndex].acfContent.geolocation.latitude,
              installers[activeCardIndex].acfContent.geolocation.longitude,
            ]}
            offset={isMobile ? [0, 120] : [100, 0]}
          >
            <div className={`relative ${isMobile ? '-translate-x-1/2' : ''}`}>
              <InstallerCard
                title={installers[activeCardIndex].title}
                address={installers[activeCardIndex].acfContent.address}
                distance={installers[activeCardIndex].distance}
                phone={installers[activeCardIndex].acfContent?.phone}
                email={installers[activeCardIndex].acfContent?.email}
                variant="map"
                installerId={installers[activeCardIndex].databaseId}
              />
              <button
                className="absolute top-2 right-2 text-sm text-primary duration-300 hover:text-secondary"
                onClick={() => setActiveCardIndex(null)}
              >
                ✕
              </button>
            </div>
          </Overlay>
        )}
      </Map>
    </div>
  );
};

export default InstallerMap;
