import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { CREATE_CUSTOMER_AND_ORDER } from '@/utils/gql/GQL_MUTATIONS';

interface RegisterFormData {
  email: string;
  createAccount: boolean;
  password?: string;
  billing: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    postcode: string;
    phone: string;
    country: string;
  };
  shipping: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    postcode: string;
    country: string;
  };
  shipToDifferentAddress: boolean;
}

interface RegisterFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export const RegisterForm = ({ onSuccess, onError }: RegisterFormProps) => {
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const [createCustomerAndOrder, { loading }] = useMutation(
    CREATE_CUSTOMER_AND_ORDER,
    {
      onCompleted: () => {
        onSuccess();
      },
      onError: (error) => {
        onError(error.message);
      },
    },
  );

  const onSubmit = async (data: RegisterFormData) => {
    // Si l'adresse de livraison est la même que la facturation
    if (!shipToDifferentAddress) {
      data.shipping = data.billing;
    }

    try {
      await createCustomerAndOrder({
        variables: {
          input: {
            clientMutationId: 'create_customer_and_order',
            ...data,
          },
        },
      });
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto mt-8">
      <div className="space-y-6">
        {/* Email et création de compte */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Informations de contact
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Email *</label>
              <input
                type="email"
                {...register('email', { required: 'Email requis' })}
                className="w-full border rounded p-2"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={createAccount}
                  onChange={(e) => setCreateAccount(e.target.checked)}
                  className="mr-2"
                />
                Créer un compte
              </label>
            </div>

            {createAccount && (
              <div>
                <label className="block mb-1">Mot de passe *</label>
                <input
                  type="password"
                  {...register('password', {
                    required: createAccount ? 'Mot de passe requis' : false,
                    minLength: {
                      value: 6,
                      message:
                        'Le mot de passe doit contenir au moins 6 caractères',
                    },
                  })}
                  className="w-full border rounded p-2"
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Adresse de facturation */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Adresse de facturation</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Prénom *</label>
              <input
                {...register('billing.firstName', {
                  required: 'Prénom requis',
                })}
                className="w-full border rounded p-2"
              />
              {errors.billing?.firstName && (
                <span className="text-red-500 text-sm">
                  {errors.billing.firstName.message}
                </span>
              )}
            </div>

            <div>
              <label className="block mb-1">Nom *</label>
              <input
                {...register('billing.lastName', { required: 'Nom requis' })}
                className="w-full border rounded p-2"
              />
              {errors.billing?.lastName && (
                <span className="text-red-500 text-sm">
                  {errors.billing.lastName.message}
                </span>
              )}
            </div>

            <div className="col-span-2">
              <label className="block mb-1">Adresse *</label>
              <input
                {...register('billing.address1', {
                  required: 'Adresse requise',
                })}
                className="w-full border rounded p-2"
              />
              {errors.billing?.address1 && (
                <span className="text-red-500 text-sm">
                  {errors.billing.address1.message}
                </span>
              )}
            </div>

            <div>
              <label className="block mb-1">Ville *</label>
              <input
                {...register('billing.city', { required: 'Ville requise' })}
                className="w-full border rounded p-2"
              />
              {errors.billing?.city && (
                <span className="text-red-500 text-sm">
                  {errors.billing.city.message}
                </span>
              )}
            </div>

            <div>
              <label className="block mb-1">Code postal *</label>
              <input
                {...register('billing.postcode', {
                  required: 'Code postal requis',
                })}
                className="w-full border rounded p-2"
              />
              {errors.billing?.postcode && (
                <span className="text-red-500 text-sm">
                  {errors.billing.postcode.message}
                </span>
              )}
            </div>

            <div>
              <label className="block mb-1">Téléphone *</label>
              <input
                type="tel"
                {...register('billing.phone', { required: 'Téléphone requis' })}
                className="w-full border rounded p-2"
              />
              {errors.billing?.phone && (
                <span className="text-red-500 text-sm">
                  {errors.billing.phone.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Option livraison différente */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={shipToDifferentAddress}
              onChange={(e) => setShipToDifferentAddress(e.target.checked)}
              className="mr-2"
            />
            Livrer à une adresse différente ?
          </label>
        </div>

        {/* Adresse de livraison */}
        {shipToDifferentAddress && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Adresse de livraison</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Mêmes champs que l'adresse de facturation mais pour shipping */}
              {/* ... */}
            </div>
          </div>
        )}

        {/* Bouton de soumission */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Traitement en cours...' : 'Commander'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
