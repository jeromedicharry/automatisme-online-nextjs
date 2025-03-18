export interface OrderProps {
  orderNumber: string;
  date: string;
  status: string;
  subtotal: string;
  totalTax: string;
  total: string;
  lineItems: {
    nodes: {
      product: {
        node: {
          name: string;
          sku: string;
          featuredImage: {
            node: {
              sourceUrl: string;
            };
          };
        };
      };
    }[];
  };
}
