import React, { useState } from 'react';
// import BreadCrumbs from '../atoms/BreadCrumbs';
import EmptyElement from '../../EmptyElement';
import { OrderSvg } from '../../SVG/Icons';
import BackToAccountNav from '../BackToAccountNav';
import { GET_CUSTOMER_ORDERS } from '@/utils/gql/CUSTOMER_QUERIES';
import useAuth from '@/hooks/useAuth';
import { useQuery } from '@apollo/client';
import OrdersList from './OrdersList';
import Cta from '@/components/atoms/Cta';
import AccountLoader from '@/components/Account/AccountLoader';

const Orders = ({
  setMobileNavClosed,
}: {
  setMobileNavClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user, loggedIn } = useAuth();

  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [hasMoreOrders, setHasMoreOrders] = useState<boolean>(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const perPage = 1;

  const { loading, error, fetchMore } = useQuery(GET_CUSTOMER_ORDERS, {
    variables: { id: user?.id, first: perPage, after: null },
    skip: !loggedIn,
    onCompleted: (data) => {
      if (data?.customer?.orders?.nodes) {
        setAllOrders(data.customer.orders.nodes);
        setHasMoreOrders(data.customer.orders.pageInfo.hasNextPage);
        setEndCursor(data.customer.orders.pageInfo.endCursor);
      }
    },
  });

  const loadMoreOrders = () => {
    if (hasMoreOrders) {
      fetchMore({
        variables: {
          after: endCursor,
          first: perPage,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            customer: {
              ...prev.customer,
              orders: {
                ...fetchMoreResult.customer.orders,
                nodes: [
                  ...prev.customer.orders.nodes,
                  ...fetchMoreResult.customer.orders.nodes,
                ],
              },
            },
          };
        },
      }).then((result) => {
        if (result.data?.customer?.orders?.nodes) {
          setAllOrders([...allOrders, ...result.data.customer.orders.nodes]);
          setHasMoreOrders(result.data.customer.orders.pageInfo.hasNextPage);
          setEndCursor(result.data.customer.orders.pageInfo.endCursor);
        }
      });
    }
  };

  return (
    <>
      <div className="md:hidden">
        <BackToAccountNav setMobileNavClosed={setMobileNavClosed} />
      </div>
      <h1 className="text-2xl leading-general font-bold mb-6 md:mb-3 max-md:mt-6">
        Mes commandes
      </h1>

      {error && (
        <p className="text-red-500 mb-6">
          Erreur lors du chargement des commandes : {error.message}
        </p>
      )}

      {loading && allOrders.length === 0 ? (
        <AccountLoader text="Chargement des commandes..." />
      ) : allOrders && allOrders.length > 0 ? (
        <>
          <OrdersList orders={allOrders} />

          {hasMoreOrders && (
            <div className="w-fit mt-6">
              <Cta
                handleButtonClick={loadMoreOrders}
                variant="secondary"
                slug="#"
                label={loading ? 'Chargement...' : 'Afficher plus de commandes'}
              >
                {loading ? 'Chargement...' : 'Afficher plus de commandes'}
              </Cta>
            </div>
          )}
        </>
      ) : (
        <EmptyElement
          picto={<OrderSvg />}
          title="Oups, rien à afficher ici..."
          subtitle="Faites votre premier achat et vos commandes apparaîtront ici."
          ctaLabel="Je découvre les produits"
          ctaSlug="/"
          ctaType="primary"
        />
      )}
    </>
  );
};

export default Orders;
