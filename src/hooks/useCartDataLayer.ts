'use client';

import { useEffect, useCallback } from 'react';
import { calculateTTC } from '../utils/functions/calculateTTC';
import { RootObject, Product } from '@/stores/CartProvider';





declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function useCartDataLayer(cart: RootObject | null | undefined) {
  const mapCartItemsToDataLayer = useCallback((cart: RootObject) => {
    if (!cart.products?.length) return [];

    return cart.products.map((item: Product) => {
      const priceHT = parseFloat(item.price.toString());
      const priceTTC = calculateTTC(priceHT);

      return {
        item_id: item.globalUniqueId || '',
        item_name: item.name,
        affiliation: item.productBrands?.nodes[0]?.name || '',
        coupon: item.onSale ? "promo" : "",
        discount: item.onSale ? (parseFloat(item.regularPrice || '0') - priceHT) : 0,
        item_brand: item.productBrands?.nodes[0]?.name || '',
        item_category: item.seo?.breadcrumbs?.[1]?.text || '',
        item_category2: item.seo?.breadcrumbs?.[2]?.text || '',
        item_variant: item.oldProductId || '',
        location_id: "ChIJQfmWzbCylkcRIFemNNlnvIQ",
        price: priceTTC / item.qty, // Prix unitaire TTC
        quantity: item.qty
      };
    });
  }, []);


  const trackViewCart = useCallback((cart: RootObject) => {
    if (!cart?.products?.length) return;

    const items = mapCartItemsToDataLayer(cart);
    if (!items.length) return;

    // Utiliser uniquement le total des produits (sans livraison ni pose)
    const totalProductsValue = cart.totalProductsPrice;

    // Envoyer l'événement view_cart
    console.log('Sending view_cart event');
    console.log(items);
    window.dataLayer.push({
      event: "view_cart",
      ecommerce: {
        currency: "EUR",
        value: totalProductsValue,
        items: items
      }
    });
  }, [mapCartItemsToDataLayer]);

  const trackBeginCheckout = useCallback((cart: RootObject) => {
    if (!cart?.products?.length) return;

    const items = mapCartItemsToDataLayer(cart);
    if (!items.length) return;

    // Utiliser uniquement le total des produits (sans livraison ni pose)
    const totalProductsValue = cart.totalProductsPrice;

    // Envoyer l'événement begin_checkout
    window.dataLayer.push({
      event: "begin_checkout",
      ecommerce: {
        currency: "EUR",
        value: totalProductsValue,
        items: items
      }
    });
  }, [mapCartItemsToDataLayer]);

  useEffect(() => {
    if (!cart || !cart.products?.length) return;

    trackViewCart(cart);
  }, [cart, trackViewCart]);

  const fireRemarketingTag = useCallback((cart: RootObject) => {
    if (!cart?.products?.length) return;

    const items = mapCartItemsToDataLayer(cart);
    if (!items.length) return;

    // Utiliser uniquement le total des produits (sans livraison ni pose)
    const totalProductsValue = cart.totalProductsPrice;

    // Envoyer l'événement de remarketing
    window.dataLayer.push({
      event: "fireRemarketingTag",
      google_tag_params: {
        ecomm_pagetype: "cart",
        ecomm_prodid: items.map(item => item.item_id),
        ecomm_totalvalue: totalProductsValue,
        ecomm_category: items.map(item => item.item_category)
      }
    });
  }, [mapCartItemsToDataLayer]);

  useEffect(() => {
    if (!cart || !cart.products?.length) return;

    fireRemarketingTag(cart);
  }, [cart, fireRemarketingTag]);

  return { trackBeginCheckout, trackViewCart, fireRemarketingTag };
}
