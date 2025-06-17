/*eslint complexity: ["error", 20]*/

import { v4 as uuidv4 } from 'uuid';

import { RootObject, Product } from '@/stores/CartProvider';

import { ChangeEvent } from 'react';
import { COUNTRIES_LIST } from '../constants/COUNTRIES_LIST';
import { PRODUCT_IMAGE_PLACEHOLDER } from '../constants/PLACHOLDERS';
import { getProductAvailability } from './deliveryTime';
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
  type: string;
  slug: string;
  image: IImage;
  galleryImages: IGalleryImages;
  productId: number;
  price: string;
  upsell: { nodes: IProduct[] };
  hasPose?: boolean;
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
  addInstallation?: boolean;
  installationPrice?: number;
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
  cart: {
    contents: { nodes: IProductRootObject[] };
    total: string;
    subtotal: string;
    totalTax: string;
    feeTotal?: string;
  };
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

export const getFormattedCart = (
  data: IFormattedCartProps,
  isPro?: boolean,
) => {
  const formattedCart: RootObject = {
    products: [],
    totalProductsCount: 0,
    totalProductsPrice: 0,
    totalTax: parseFloat(data.cart.totalTax || '0'),
    subtotal: parseFloat(data.cart.subtotal || '0'),
    total: parseFloat(data.cart.total || '0'),
    shippingTax: 0, // Cette valeur sera mise à jour par la query GET_CART
  };

  if (!data || !data.cart || !data.cart.contents) {
    return formattedCart;
  }

  const givenProducts = data.cart.contents.nodes;

  if (!givenProducts || !givenProducts.length) {
    return formattedCart;
  }

  let totalProductsCount = 0;

  // Process products
  formattedCart.products = givenProducts.map((givenProductItem) => {
    const givenProduct = givenProductItem.product.node;
    const quantity = givenProductItem.quantity;

    // Get price values directly from GraphQL response
    const lineTotal = parseFloat(givenProductItem.total); // Total TTC
    const lineSubtotal = parseFloat(givenProductItem.subtotal); // Total HT

    // Calculate unit prices
    const unitPriceTTC = quantity > 0 ? lineTotal / quantity : 0;
    const unitPriceHT = quantity > 0 ? lineSubtotal / quantity : 0;

    const product: Product = {
      productId: givenProduct.databaseId,
      slug: givenProduct.slug,
      cartKey: givenProductItem.key,
      name: givenProduct.name,
      qty: quantity,
      price: isPro ? unitPriceHT : unitPriceTTC, // HT pour pro, TTC pour autres
      totalPrice: isPro ? lineSubtotal : lineTotal, // HT pour pro, TTC pour autres
      image: givenProduct.image?.sourceUrl
        ? {
            sourceUrl: givenProduct.image.sourceUrl,
            srcSet: givenProduct.image.srcSet,
            title: givenProduct.image.title,
          }
        : {
            sourceUrl: PRODUCT_IMAGE_PLACEHOLDER,
            srcSet: PRODUCT_IMAGE_PLACEHOLDER,
            title: givenProduct.name,
          },
      addInstallation: givenProductItem.addInstallation,
      installationPrice: givenProductItem?.installationPrice
        ? givenProductItem?.installationPrice * givenProductItem?.quantity
        : 0,
      hasPose: givenProduct.hasPose,
      deliveryLabel: getProductAvailability({
        stock: (givenProduct as any).stockQuantity,
        backorders: (givenProduct as any).backorders,
        restockingLeadTime: (givenProduct as any).restockingLeadTime,
      }).deliveryLabel,
      // upsell: givenProduct.upsell || { nodes: [] },
    };

    totalProductsCount += quantity;

    return product;
  });

  // Set cart totals
  formattedCart.totalProductsCount = totalProductsCount;

  // Use cart level totals directly from GraphQL
  const cartTotal = parseFloat(data.cart.total); // Total TTC
  const cartTotalTax = parseFloat(data.cart.totalTax); // Total TVA

  // Utiliser les totaux de WooCommerce
  formattedCart.totalProductsPrice = cartTotal; // Toujours TTC
  formattedCart.totalTax = cartTotalTax; // TVA selon les règles WooCommerce

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

export const formatDate = (dateString: string, separator: '.' | '/' = '.') => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}${separator}${month}${separator}${year}`;
};

export type OrderStatus =
  | ''
  | 'PENDING'
  | 'ON_HOLD'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED'
  | 'REFUNDED';

export const GetStatusName = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return 'En attente de paiement';
    case 'ON_HOLD':
      return 'En attente';
    case 'PROCESSING':
      return 'En cours';
    case 'COMPLETED':
      return 'Terminée';
    case 'CANCELLED':
      return 'Annulée';
    case 'FAILED':
      return 'Échouée';
    case 'REFUNDED':
      return 'Remboursée';
    default:
      return status;
  }
};
