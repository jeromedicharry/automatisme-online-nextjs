'use client';

import { useEffect } from 'react';
import { ProductContentProps } from '@/components/Product/ProductContent';
import { calculateTTC } from '../utils/functions/calculateTTC';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function useProductDataLayer(product: ProductContentProps) {
  useEffect(() => {
    if (!product) return;

    // Calculer le prix TTC
    const priceHT = parseFloat(product.price || '0');
    const priceTTC = calculateTTC(priceHT);

    console.log('Product data:', {
      ref: product.productRef,
      price: priceHT,
      priceTTC,
      brand: product.productBrands?.nodes[0]?.name
    });

    // Remarketing dynamique Google Ads
    window.dataLayer.push({
      event: "fireRemarketingTag",
      google_tag_params: {
        ecomm_pagetype: "product",
        ecomm_prodid: product.globalUniqueId || '', // Utilisation du globalUniqueId comme ID unique
        ecomm_totalvalue: priceTTC,
        ecomm_category: product.seo?.breadcrumbs?.[1]?.text || '', // Utilisation de la catégorie mère
        ecomm_totalvalue_tax_exc: priceHT,
      }
    });

    // Clear previous ecommerce object
    window.dataLayer.push({ ecommerce: null });

    // View Item event
    console.log('Sending view_item event');
    window.dataLayer.push({
      event: "view_item",
      ecommerce: {
        currency: "EUR",
        value: priceTTC,
        items: [
          {
            item_id: product.globalUniqueId || '', // ID unique du produit
            item_name: product.name || '',
            affiliation: product.productBrands?.nodes[0]?.name || '', // Nom de la marque
            coupon: product.onSale ? "promo" : "", // Si le produit est en promotion
            discount: product.onSale ? (parseFloat(product.regularPrice || '0') - parseFloat(product.price || '0')) : 0,
            item_brand: product.productBrands?.nodes[0]?.name || '',
            item_category: product.seo?.breadcrumbs?.[1]?.text || '', // Catégorie mère
            item_category2: product.seo?.breadcrumbs?.[2]?.text || '', // Sous-catégorie niveau 1
            item_variant: product.oldProductId || '', // Ancienne référence du produit
            location_id: "ChIJQfmWzbCylkcRIFemNNlnvIQ",
            price: priceTTC,
          },
        ],
      },
    });
  }, [product]);

  // Fonction pour add_to_cart
  const trackAddToCart = (quantity = 1) => {
    if (!product) return;

    // Calculer le prix TTC
    const priceHT = parseFloat(product.price || '0');
    const priceTTC = calculateTTC(priceHT);

    window.dataLayer.push({ ecommerce: null });

    console.log('Sending add_to_cart event');
    window.dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        currency: "EUR",
        value: priceTTC * quantity,
        items: [
          {
            item_id: product.globalUniqueId || '',
            item_name: product.name || '',
            affiliation: product.productBrands?.nodes[0]?.name || '',
            coupon: product.onSale ? "promo" : "",
            discount: product.onSale ? (parseFloat(product.regularPrice || '0') - parseFloat(product.price || '0')) : 0,
            item_brand: product.productBrands?.nodes[0]?.name || '',
            item_category: product.seo?.breadcrumbs?.[1]?.text || '',
            item_category2: product.seo?.breadcrumbs?.[2]?.text || '',
            item_variant: product.oldProductId || '',
            location_id: "ChIJQfmWzbCylkcRIFemNNlnvIQ",
            price: priceTTC * quantity,
            quantity: quantity,
          },
        ],
      },
    });
  };

  return { trackAddToCart };
}
