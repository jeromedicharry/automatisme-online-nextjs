import { isProRole } from '@/utils/functions/functions';
import { useQuery, gql, ApolloError } from '@apollo/client';
import React, { createContext, useContext, ReactNode } from 'react';

export interface User {
  id: string;
  databaseId: number;
  firstName?: string;
  lastName?: string;
  email: string;
  roles: { nodes: { name: string }[] };
}

interface AuthData {
  loggedIn: boolean;
  user?: User;
  countryCode?: string;
  loading: boolean;
  error?: ApolloError;
  isPro: boolean;
}

const DEFAULT_STATE: AuthData = {
  loggedIn: false,
  user: undefined,
  loading: false,
  error: undefined,
  isPro: false,
};

const AuthContext = createContext(DEFAULT_STATE);

export const GET_USER = gql`
  query GET_USER {
    viewer {
      id
      databaseId
      firstName
      lastName
      email
      roles {
        nodes {
          name
        }
      }
    }
    customer {
      billing {
        country
      }
    }
  }
`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, loading, error } = useQuery(GET_USER);
  const user = data?.viewer;
  const loggedIn = Boolean(user);

  const isPro = isProRole(user?.roles?.nodes);
  const countryCode = data?.customer?.billing?.country;

  const value = {
    loggedIn,
    user,
    isPro,
    loading,
    error,
    countryCode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const useAuth = () => useContext(AuthContext);

export default useAuth;
