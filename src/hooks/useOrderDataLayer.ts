'use client';

import { useCallback } from 'react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  brand?: string;
  category?: string;
  variant?: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  tax: number;
  shipping: number;
  currency: string;
}

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function useOrderDataLayer() {
  const trackPurchase = useCallback((order: Order) => {
    if (!order?.items?.length) return;

    const items = order.items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      affiliation: item.brand || '',
      item_brand: item.brand || '',
      item_category: item.category || '',
      item_variant: item.variant || '',
      price: item.price,
      quantity: item.quantity
    }));

    // Clear previous ecommerce object
    window.dataLayer.push({ ecommerce: null });

    // Envoyer l'événement purchase
    window.dataLayer.push({
      event: "purchase",
      ecommerce: {
        currency: order.currency || "EUR",
        value: order.total,
        tax: order.tax,
        shipping: order.shipping,
        transaction_id: order.id,
        items: items
      }
    });

    // Envoyer l'événement de remarketing
    window.dataLayer.push({
      event: "fireRemarketingTag",
      google_tag_params: {
        ecomm_pagetype: "confirmation",
        ecomm_prodid: items.map(item => item.item_id).join(","),
        ecomm_category: items.map(item => item.item_category).join(","),
        ecomm_totalvalue: order.total,
        ecomm_totalvalue_tax_exc: order.total - order.tax
      }
    });
  }, []);

  return { trackPurchase };
}
