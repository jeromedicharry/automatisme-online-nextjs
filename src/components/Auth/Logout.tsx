import useAuth, { GET_USER } from '@/hooks/useAuth';
import { useMutation, gql } from '@apollo/client';
import { Chevron, LogoutSvg } from '../SVG/Icons';
import { useCartOperations } from '@/hooks/useCartOperations';

export const LOG_OUT = gql`
  mutation logOut {
    logout(input: {}) {
      status
    }
  }
`;

export default function LogOut() {
  const { loggedIn } = useAuth();
  const { refetchCart } = useCartOperations();
  const [logOut, { loading }] = useMutation(LOG_OUT, {
    refetchQueries: [{ query: GET_USER }],
    onCompleted: () => {
      // Nettoyage du panier à la déconnexion
      localStorage.removeItem('woocommerce-cart');
      localStorage.removeItem('woo-session');
      // Création d'un nouveau panier anonyme
      refetchCart().catch(console.error);
    },
  });

  const handleLogout = () => {
    logOut().catch((error) => {
      console.error(error);
    });
  };

  return loggedIn ? (
    <button
      onClick={() => handleLogout()}
      className={`w-full gap-3 font-bold flex items-center duration-300 justify-between`}
    >
      <div className="flex gap-[10px] items-center">
        <LogoutSvg /> {`${loading ? 'Déconnexion...' : 'Déconnexion'}`}
      </div>
      <div className="rotate-180">
        <Chevron />
      </div>
    </button>
  ) : null;
}
