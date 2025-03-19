/*eslint complexity: ["error", 20]*/

import { v4 as uuidv4 } from 'uuid';

import { RootObject, Product } from '@/stores/CartProvider';

import { ChangeEvent } from 'react';
import { COUNTRIES_LIST } from '../constants/COUNTRIES_LIST';
import { calculerPrix, getTauxTVA } from './prices';
// import { IVariationNodes } from '@/components/Product/AddToCart';

/* Interface for products*/

export interface IImage {
  __typename: string;
  id: string;
  sourceUrl?: string;
  srcSet?: string;
  altText: string;
  title: string;
}

export interface IGalleryImages {
  __typename: string;
  nodes: IImage[];
}

interface IProductNode {
  __typename: string;
  id: string;
  databaseId: number;
  name: string;
  description: string;
  type: string;
  onSale: boolean;
  slug: string;
  averageRating: number;
  reviewCount: number;
  image: IImage;
  galleryImages: IGalleryImages;
  productId: number;
}

interface IProduct {
  __typename: string;
  node: IProductNode;
}

export interface IProductRootObject {
  __typename: string;
  key: string;
  product: IProduct;
  // variation?: IVariationNodes;
  quantity: number;
  total: string;
  subtotal: string;
  subtotalTax: string;
}

type TUpdatedItems = { key: string; quantity: number }[];

export interface IUpdateCartItem {
  key: string;
  quantity: number;
}

export interface IUpdateCartInput {
  clientMutationId: string;
  items: IUpdateCartItem[];
}

export interface IUpdateCartVariables {
  input: IUpdateCartInput;
}

export interface IUpdateCartRootObject {
  variables: IUpdateCartVariables;
}

/* Interface for props */

interface IFormattedCartProps {
  cart: { contents: { nodes: IProductRootObject[] }; total: number };
}

export interface ICheckoutDataProps {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  country: string;
  state: string;
  postcode: string;
  email: string;
  phone: string;
  company: string;
  paymentMethod: string;
}

/**
 * Add empty character after currency symbol
 * @param {string} price The price string that we input
 * @param {string} symbol Currency symbol to add empty character/padding after
 */

export const paddedPrice = (price: string, symbol: string) =>
  price.split(symbol).join(`${symbol} `);

/**
 * Shorten inputted string (usually product description) to a maximum of length
 * @param {string} input The string that we input
 * @param {number} length The length that we want to shorten the text to
 */
export const trimmedStringToLength = (input: string, length: number) => {
  if (input.length > length) {
    const subStr = input.substring(0, length);
    return `${subStr}...`;
  }
  return input;
};

/**
 * Returns cart data in the required format.
 * @param {String} data Cart data
 */

export const getFormattedCart = async (
  data: IFormattedCartProps,
  user?: any,
  countryCode?: string,
): Promise<RootObject | undefined> => {
  const formattedCart: RootObject = {
    products: [],
    totalProductsCount: 0,
    totalProductsPrice: 0,
    taxInfo: {
      isPriceHT: false,
      countryCode: 'FR',
      taxRate: 20,
    },
  };

  if (!data) {
    return;
  }

  const isProSession = isProRole(user?.roles?.nodes);
  const givenProducts = data.cart.contents.nodes;

  // Create an empty object.
  formattedCart.products = [];
  let totalProductsCount = 0;
  let totalPrice = 0;

  if (!givenProducts.length) {
    return;
  }

  // Traitement asynchrone des produits
  const productPromises = givenProducts.map(async (givenProductItem) => {
    const givenProduct = givenProductItem.product.node;

    // Extraire le prix HT
    const rawPrice = givenProductItem.total.replace(/[^0-9.-]+/g, '');
    const quantity = givenProductItem.quantity;
    const prixUnitaireHT = Number(rawPrice) / quantity;

    // Calculer le prix final avec TVA si nécessaire
    const prixFinal = await calculerPrix(
      prixUnitaireHT,
      isProSession,
      countryCode || 'FR',
    );

    const product: Product = {
      productId: givenProduct.productId,
      cartKey: givenProductItem.key,
      name: givenProduct.name,
      qty: quantity,
      price: isProSession ? prixUnitaireHT : prixFinal, // HT pour pro, TTC pour autres
      originalPrice: prixUnitaireHT, // Conserver le prix HT original
      totalPrice: isProSession
        ? prixUnitaireHT * quantity
        : prixFinal * quantity,
      isPriceHT: isProSession, // Indiquer si le prix est HT ou TTC
      image: givenProduct.image.sourceUrl
        ? {
            sourceUrl: givenProduct.image.sourceUrl,
            srcSet: givenProduct.image.srcSet,
            title: givenProduct.image.title,
          }
        : {
            sourceUrl: process.env.NEXT_PUBLIC_PLACEHOLDER_SMALL_IMAGE_URL,
            srcSet: process.env.NEXT_PUBLIC_PLACEHOLDER_SMALL_IMAGE_URL,
            title: givenProduct.name,
          },
      upsell: { nodes: [] },
    };

    totalProductsCount += quantity;
    totalPrice += isProSession
      ? prixUnitaireHT * quantity
      : prixFinal * quantity;

    return product;
  });

  // Attendre que tous les produits soient traités
  formattedCart.products = await Promise.all(productPromises);
  formattedCart.totalProductsCount = totalProductsCount;
  formattedCart.totalProductsPrice = totalPrice;

  // Ajouter des informations supplémentaires sur la TVA
  formattedCart.taxInfo = {
    isPriceHT: isProSession,
    countryCode: countryCode || 'FR',
    taxRate: isProSession ? 0 : await getTauxTVA(countryCode || 'FR'),
  };

  return formattedCart;
};

export const createCheckoutData = (order: ICheckoutDataProps) => ({
  clientMutationId: uuidv4(),
  billing: {
    firstName: order.firstName,
    lastName: order.lastName,
    address1: order.address1,
    address2: order.address2,
    city: order.city,
    country: order.country,
    state: order.state,
    postcode: order.postcode,
    email: order.email,
    phone: order.phone,
    company: order.company,
  },
  shipping: {
    firstName: order.firstName,
    lastName: order.lastName,
    address1: order.address1,
    address2: order.address2,
    city: order.city,
    country: order.country,
    state: order.state,
    postcode: order.postcode,
    email: order.email,
    phone: order.phone,
    company: order.company,
  },
  shipToDifferentAddress: false,
  paymentMethod: order.paymentMethod,
  isPaid: false,
  transactionId: 'fhggdfjgfi',
});

/**
 * Get the updated items in the below format required for mutation input.
 *
 * Creates an array in above format with the newQty (updated Qty ).
 *
 */
export const getUpdatedItems = (
  products: IProductRootObject[],
  newQty: number,
  cartKey: string,
) => {
  // Create an empty array.

  const updatedItems: TUpdatedItems = [];

  // Loop through the product array.
  products.forEach((cartItem) => {
    // If you find the cart key of the product user is trying to update, push the key and new qty.
    if (cartItem.key === cartKey) {
      updatedItems.push({
        key: cartItem.key,
        quantity: newQty,
      });

      // Otherwise just push the existing qty without updating.
    } else {
      updatedItems.push({
        key: cartItem.key,
        quantity: cartItem.quantity,
      });
    }
  });

  // Return the updatedItems array with new Qtys.
  return updatedItems;
};

/*
 * When user changes the quantity, update the cart in localStorage
 * Also update the cart in the global Context
 */
export const handleQuantityChange = (
  event: ChangeEvent<HTMLInputElement>,
  cartKey: string,
  cart: IProductRootObject[],
  updateCart: (variables: IUpdateCartRootObject) => void,
  updateCartProcessing: boolean,
) => {
  if (process.browser) {
    event.stopPropagation();

    // Return if the previous update cart mutation request is still processing
    if (updateCartProcessing || !cart) {
      return;
    }

    // If the user tries to delete the count of product, set that to 1 by default ( This will not allow him to reduce it less than zero )
    const newQty = event.target.value ? parseInt(event.target.value, 10) : 1;

    if (cart.length) {
      const updatedItems = getUpdatedItems(cart, newQty, cartKey);

      updateCart({
        variables: {
          input: {
            clientMutationId: uuidv4(),
            items: updatedItems,
          },
        },
      });
    }
  }
};

export const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

export const makeRelativeLink = (url: string): string => {
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL;

  if (!adminUrl) {
    console.warn("NEXT_PUBLIC_ADMIN_URL n'est pas défini.");
    return url;
  }

  return url.startsWith(adminUrl) ? url.replace(adminUrl, '') : url;
};

export function formatPhoneNumber(phone: string) {
  if (!phone) return '';

  // Supprimer tout sauf les chiffres et le +
  let cleaned = phone.replace(/[^\d+]/g, '');

  // Vérifier si le numéro commence par un indicatif international
  let hasInternationalPrefix = cleaned.startsWith('+');

  // Supprimer le + temporairement pour la mise en forme
  if (hasInternationalPrefix) {
    cleaned = cleaned.substring(1);
  }

  // Détecter la longueur du numéro pour adapter le format
  if (cleaned.length === 10) {
    // Format national (ex: FR, BE, etc.)
    cleaned = cleaned.replace(
      /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
      '$1 $2 $3 $4 $5',
    );
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    // USA / Canada (ex: 1XXXXXXXXXX -> (XXX) XXX-XXXX)
    cleaned = cleaned.replace(/1(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length >= 11 && cleaned.length <= 15) {
    // Format international standard (ex: +33 6 XX XX XX XX)
    cleaned = cleaned
      .replace(
        /(\d{1,3})(\d{2,3})(\d{2,3})(\d{2,3})(\d{0,4})/,
        '$1 $2 $3 $4 $5',
      )
      .trim();
  }

  // Ajouter de nouveau le préfixe international si présent
  return hasInternationalPrefix ? `+${cleaned}` : cleaned;
}

export const getCountryName = (countryCode: string) => {
  const country = COUNTRIES_LIST.find((c) => c.code === countryCode);
  return country ? country.name : '';
};

export const isProRole = (roles?: { name: string }[]): boolean => {
  return roles?.some((role) => role.name === 'pro_customer') ?? false;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};
