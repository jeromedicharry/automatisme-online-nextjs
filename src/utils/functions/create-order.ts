// utils/wooCommerce/create-order.ts

export async function createWooCommerceOrder(orderData: any) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/orders`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_WOOCOMMERCE_KEY}:${process.env.NEXT_PUBLIC_WOOCOMMERCE_SECRET}`,
          ).toString('base64')}`,
        },
        body: JSON.stringify(orderData),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to create WooCommerce order');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating WooCommerce order:', error);
    throw error;
  }
}
