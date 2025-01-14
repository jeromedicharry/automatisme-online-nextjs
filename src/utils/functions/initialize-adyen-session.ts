// utils/adyen/initialize-session.ts

export async function initializeAdyenSession(order: any) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/adyen/v1/sessions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_WOOCOMMERCE_KEY}:${process.env.NEXT_PUBLIC_WOOCOMMERCE_SECRET}`,
          ).toString('base64')}`,
        },
        body: JSON.stringify({
          order_id: order.id,
          amount: order.total,
          currency: order.currency,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to initialize Adyen session');
    }

    return await response.json();
  } catch (error) {
    console.error('Error initializing Adyen session:', error);
    throw error;
  }
}
