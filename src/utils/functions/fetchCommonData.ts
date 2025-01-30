// Utilities
import client from '@/utils/apollo/ApolloClient';

// GraphQL Queries
import {
  GET_ALL_LEVEL_1_CATEGORIES,
  GET_FOOTER_MENU_1,
  GET_FOOTER_MENU_2,
  GET_OPTIONS,
} from '@/utils/gql/WEBSITE_QUERIES';

export const fetchCommonData = async () => {
  const [categoriesMenu, options, footerMenu1, footerMenu2] = await Promise.all(
    [
      client.query({ query: GET_ALL_LEVEL_1_CATEGORIES }),
      client.query({ query: GET_OPTIONS }),
      client.query({ query: GET_FOOTER_MENU_1 }),
      client.query({ query: GET_FOOTER_MENU_2 }),
    ],
  );

  return {
    categoriesMenu: categoriesMenu?.data?.productCategories?.nodes || [],
    themeSettings: options?.data?.themeSettings?.optionsFields || null,
    footerMenu1: footerMenu1?.data?.menu || null,
    footerMenu2: footerMenu2?.data?.menu || null,
  };
};
