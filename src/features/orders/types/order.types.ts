// export enum OrderStatus {
//   PENDING = 'pending',
//   PAID = 'paid',
//   SHIPPED = 'shipped',
//   CANCELLED = 'cancelled',
// }

// export interface OrderItem {
//   id: number;
//   quantity: number;
//   priceAtPurchase: number;
//   ProductId: number;
//   Product: Product;
// }

// export interface Order {
//   id: number;
//   totalAmount: number;
//   status: OrderStatus;
//   address: string;
//   createdAt: string;
//   updatedAt: string;
//   UserId: number;
//   User?: User;
//   Products?: Product[];
//   OrderItems?: OrderItem[];
// }

// export interface CreateOrderDTO {
//   items: Array<{
//     productId: number;
//     quantity: number;
//   }>;
//   address: string;
// }