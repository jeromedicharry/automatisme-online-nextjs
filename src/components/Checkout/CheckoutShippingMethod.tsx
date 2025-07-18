import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALEX_SHIPPING_METHOD } from '@/utils/gql/GQL_MUTATIONS';
import { GET_CUSTOMER_ADDRESSES } from '@/utils/gql/CUSTOMER_QUERIES';
import {
  SET_CART_SHIPPING_METHOD,
  SET_RELAY_POINT,
} from '@/utils/gql/GQL_MUTATIONS';
import { GET_CART } from '@/utils/gql/WOOCOMMERCE_QUERIES';
import { GET_RELAY_POINTS } from '@/utils/gql/RELAY_POINTS_QUERY';
import useAuth from '@/hooks/useAuth';
import { useCartOperations } from '@/hooks/useCartOperations';
import BlocIntroSmall from '../atoms/BlocIntroSmall';

interface ShippingMethod {
  id: string;
  label: string;
  cost: string;
  delayMin: number;
  delayMax: number;
  description: string;
}

interface RelayPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  distance_km: number;
  distance_meters: number;
  user_coordinates: { lat: number; lon: number };
  relay_coordinates: { lat: number; lon: number };
  distance_calculation: {
    user_lat: number;
    user_lon: number;
    relay_lat: number;
    relay_lon: number;
    raw_distance_km: number;
    calculation_method: string;
  };
}

const CheckoutShippingMethod = ({
  setIsShippingMethodComplete,
}: {
  setIsShippingMethodComplete: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(true);
  const [selectedRelayPoint, setSelectedRelayPoint] =
    useState<RelayPoint | null>(null);
  const [showRelayPoints, setShowRelayPoints] = useState(false);
  const [setShippingMethod] = useMutation(SET_CART_SHIPPING_METHOD);
  const [setRelayPoint] = useMutation(SET_RELAY_POINT);

  const { user, loggedIn } = useAuth();
  const { cart } = useCartOperations();

  // Récupérer les méthodes de livraison du backend
  const { data: shippingMethodsData, refetch: refetchShippingMethods } =
    useQuery(GET_ALEX_SHIPPING_METHOD);
  const { refetch: refetchCart } = useQuery(GET_CART);

  // Récupérer les adresses du client
  const { data: customerData } = useQuery(GET_CUSTOMER_ADDRESSES, {
    variables: { id: user?.id },
    skip: !loggedIn,
  });
  const shippingAddress = customerData?.customer?.shipping;

  // Query pour les points relais
  const { data: relayPointsData, loading: relayPointsLoading } = useQuery(
    GET_RELAY_POINTS,
    {
      variables: {
        zipCode: shippingAddress?.postcode || '',
        city: shippingAddress?.city || '',
        userAddress: shippingAddress?.address1,
        limit: 5,
      },
      skip:
        !loggedIn ||
        !showRelayPoints ||
        !shippingAddress?.postcode ||
        !shippingAddress?.city,
    },
  );

  // Vérifier si la méthode point relais est sélectionnée par défaut
  useEffect(() => {
    if (
      shippingMethodsData?.cart?.chosenShippingMethods?.[0] ===
      'carrier_dynamic_relais'
    ) {
      setShowRelayPoints(true);

      // Si un point relais est déjà sélectionné dans le panier
      if (cart?.relayPoint && relayPointsData?.relayPoints?.relay_points) {
        // Trouver le point relais correspondant dans la liste
        const selectedPoint = relayPointsData.relayPoints.relay_points.find(
          (point: { id: string }) => point.id === cart.relayPoint,
        );
        if (selectedPoint) {
          setSelectedRelayPoint(selectedPoint);
          setIsShippingMethodComplete(true);
        }
      }
    }
  }, [
    shippingMethodsData,
    cart?.relayPoint,
    relayPointsData?.relayPoints,
    setIsShippingMethodComplete,
    setShowRelayPoints,
  ]);

  // Gérer le changement manuel de méthode de livraison
  const handleShippingMethodChange = async (
    methodId: string,
    isRelayPoint: boolean = false,
  ) => {
    try {
      await setShippingMethod({
        variables: {
          shippingMethodId: methodId,
        },
      });

      // Après la mutation, rafraîchir les données pour mettre à jour l'UI
      await Promise.all([refetchShippingMethods(), refetchCart()]);

      if (isRelayPoint) {
        setShowRelayPoints(true);
      } else {
        setShowRelayPoints(false);
        setSelectedRelayPoint(null);
      }
      setIsShippingMethodComplete(true);
    } catch (error) {
      console.error('Error setting shipping method:', error);
      setIsShippingMethodComplete(false);
    }
  };

  // Formater le temps de livraison
  const formatDeliveryTime = (delayMin: number, delayMax: number) => {
    if (delayMin === delayMax) {
      return `${delayMin} jours ouvrés`;
    }
    return `${delayMin} à ${delayMax} jours ouvrés`;
  };

  // Vérifier si une méthode est sélectionnée
  useEffect(() => {
    if (shippingMethodsData?.cart?.chosenShippingMethods?.length > 0) {
      setIsShippingMethodComplete(true);
    }
    setLoading(false);
  }, [shippingMethodsData, setIsShippingMethodComplete]);

  // Rendu des points relais
  const renderRelayPoints = () => {
    if (!showRelayPoints) return null;

    if (relayPointsLoading) {
      return (
        <div className="mt-4 p-4 border rounded-lg">
          <p className="text-center">Chargement des points relais...</p>
        </div>
      );
    }

    const relayPoints = relayPointsData?.relayPoints?.relay_points || [];

    return (
      <div className="mt-4 md:mt-8">
        <BlocIntroSmall
          title="Points relais"
          subtitle="Veuillez choisir un point relais"
        />
        {relayPoints.length === 0 && (
          <p className="text-dark-grey">
            Aucun point relais disponible, vérifiez votre adresse de livraison
          </p>
        )}
        <div className="space-y-4">
          {relayPoints.map((point: RelayPoint, key: number) => (
            <div
              key={key}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedRelayPoint?.id === point.id
                  ? 'border-secondary bg-white'
                  : 'border-light-grey hover:border-secondary'
              }`}
              onClick={async () => {
                try {
                  const response = await setRelayPoint({
                    variables: {
                      relayId: point.id,
                      relayName: point.name,
                      relayAddress: point.address,
                      relayZip: point.zipCode,
                      relayCity: point.city,
                      relayCountry: 'FR',
                      relayInfo: JSON.stringify({
                        lat: point.latitude,
                        lon: point.longitude,
                      }),
                    },
                  });

                  if (response.data?.setRelayPoint?.success) {
                    setSelectedRelayPoint(point);
                    setIsShippingMethodComplete(true);
                    // Rafraîchir les données du panier et des méthodes de livraison
                    await Promise.all([
                      refetchShippingMethods(),
                      refetchCart(),
                    ]);
                  }
                } catch (error) {
                  console.error('Error setting relay point:', error);
                }
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{point.name}</h4>
                  <p className="text-dark-grey text-sm mt-1">{point.address}</p>
                  <p className="text-dark-grey text-sm">
                    {point.zipCode} {point.city}
                  </p>
                </div>
                <div className="text-secondary font-bold">
                  {point.distance_calculation.raw_distance_km.toFixed(2)} km
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <section>
        <BlocIntroSmall title="Sélectionnez votre méthode de livraison" />
        <div className="mt-4">
          <div className="text-center py-4">
            <p>Chargement des méthodes de livraison...</p>
          </div>
          {showRelayPoints && renderRelayPoints()}
        </div>
      </section>
    );
  }

  const chosenMethodId = shippingMethodsData?.cart?.chosenShippingMethods?.[0];
  const methods = shippingMethodsData?.cart?.dynamicShippingMethods || [];

  return (
    <section>
      <BlocIntroSmall title="Sélectionnez votre méthode de livraison" />
      <div className="mt-4">
        {methods.length > 0 ? (
          <div className="space-y-4">
            {methods.map((method: ShippingMethod) => {
              // Vérifier si la méthode est sélectionnée en comparant avec l'ID choisi
              const isSelected = chosenMethodId === method.id;

              // Pour les méthodes carrier_dynamic, vérifier aussi le type (relais/express)
              const isRelaisSelected =
                chosenMethodId === 'carrier_dynamic_relais' &&
                method.id === 'carrier_dynamic' &&
                method.label.toLowerCase().includes('relais');

              return (
                <label
                  key={method.id}
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                    isSelected || isRelaisSelected
                      ? 'border-secondary bg-white'
                      : 'border-light-grey hover:border-secondary'
                  }`}
                >
                  <div className="flex h-5 items-center">
                    <input
                      type="radio"
                      name="shipping-method"
                      value={method.id}
                      checked={isSelected || isRelaisSelected}
                      onChange={() =>
                        handleShippingMethodChange(
                          // Si c'est une méthode relais, utiliser carrier_dynamic_relais
                          method.label.toLowerCase().includes('relais')
                            ? 'carrier_dynamic_relais'
                            : method.id,
                          method.label.toLowerCase().includes('relais'),
                        )
                      }
                      className="h-4 w-4 border-gray-300 text-primary focus:ring-secondary accent-secondary"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-primary flex justify-between items-center">
                      <span>{method.label}</span>
                      <span className="text-secondary font-bold">
                        {method.cost === '0' || method.cost === '0.00'
                          ? 'Gratuit'
                          : `${parseFloat(method.cost).toFixed(2)}€`}
                      </span>
                    </div>
                    <p className="text-sm leading-general text-dark-grey mt-1">
                      {method.description} - Livraison sous{' '}
                      {formatDeliveryTime(method.delayMin, method.delayMax)}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <p>Aucune méthode de livraison disponible.</p>
          </div>
        )}
        {showRelayPoints && renderRelayPoints()}
      </div>
    </section>
  );
};

export default CheckoutShippingMethod;
